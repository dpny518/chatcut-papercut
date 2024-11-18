from fastapi import UploadFile
from app.services.file_handlers import image_handler, docx_handler, txt_handler, json_handler, srtx_handler
from datetime import datetime
import uuid
import logging

logger = logging.getLogger(__name__)
async def process_file(file: UploadFile):
    logger.info(f"Processing file: {file.filename}")
    try:
        content = await file.read()
        file.file.seek(0)  # Reset file pointer to the beginning
        
        if file.filename.endswith('.txt'):
            logger.info("Using TXT parser")
            parsed = await txt_handler.parse(content)
        elif file.filename.endswith('.docx'):
            logger.info("Using DOCX parser")
            try:
                parsed = await docx_handler.parse_to_schema(file)
            except Exception as e:
                logger.error(f"Error in DOCX parsing: {str(e)}")
                logger.error(traceback.format_exc())
                raise HTTPException(status_code=500, detail=f"Error processing DOCX file: {str(e)}")
        elif file.filename.endswith('.pdf'):
            logger.info("Using PDF parser")
            parsed = await image_handler.parse(file.file)
        elif file.filename.endswith('.json'):
            logger.info("Using JSON parser")
            parsed = await json_handler.parse(content)
        elif file.filename.endswith('.srtx'):
            logger.info("Using SRTX parser")
            parsed = await srtx_handler.parse(content)
        else:
            logger.error(f"Unsupported file type: {file.filename}")
            raise ValueError(f"Unsupported file type: {file.filename}")

        logger.info(f"Parsed content length: {len(parsed) if parsed else 'N/A'}")
        result = create_project_structure(parsed, file.filename, len(content))
        logger.info(f"Created project structure with {len(result['transcript']['segments'])} segments")
        return result
    except Exception as e:
        logger.error(f"Error processing file {file.filename}: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

def create_project_structure(parsed_content, file_name, file_size):
    logger.info(f"Creating project structure for {file_name}")
    project_id = str(uuid.uuid4())
    media_id = str(uuid.uuid4())
    
    if parsed_content and 'end_time' in parsed_content[-1]:
        estimated_duration = parsed_content[-1]['end_time']
    else:
        estimated_duration = None
    
    logger.info(f"Estimated duration: {estimated_duration}")

    project = {
        "project_id": project_id,
        "media": {
            "id": media_id,
            "source": file_name,
            "duration": estimated_duration,
            "uploaded_on": datetime.now().isoformat()
        },
        "transcript": {
            "segments": []
        },
        "edits": []
    }

    for content in parsed_content:
        segment_id = str(uuid.uuid4())
        
        start_time = content.get('start_time', 0)
        end_time = content.get('end_time', start_time)
        
        # Check if word-level timing is available
        if 'words' in content and all('start' in word and 'end' in word for word in content['words']):
            words_data = content['words']
        else:
            # If no word-level timing, create basic word list
            words = content['text'].split()
            words_data = [{"word": word} for word in words]

        segment = {
            "segment_id": segment_id,
            "start_time": start_time,
            "end_time": end_time,
            "text": content['text'],
            "speaker": content.get('speaker', "Unknown"),
            "words": words_data
        }

        project['transcript']['segments'].append(segment)

    logger.info(f"Created project structure with {len(project['transcript']['segments'])} segments")
    return project