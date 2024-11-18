import logging
from docx import Document
import re
import uuid
from datetime import datetime
from io import BytesIO

logger = logging.getLogger(__name__)

def timestamp_to_seconds(timestamp):
    try:
        minutes, seconds = map(int, timestamp.split(':'))
        return minutes * 60 + seconds
    except ValueError as e:
        logger.error(f"Error converting timestamp {timestamp}: {e}")
        return 0

def clean_text(text):
    return re.sub(r'\*\*|\*', '', text).strip()

async def parse_to_schema(file):
    try:
        logger.info(f"Starting DOCX parsing for file: {file.filename}")
        
        # Convert UploadFile to BytesIO
        file_content = await file.read()
        logger.info(f"File content length: {len(file_content)} bytes")
        
        doc = Document(BytesIO(file_content))
        logger.info(f"DOCX document created successfully")
        
        
        segments = []
        project_id = str(uuid.uuid4())
        media_id = str(uuid.uuid4())
        uploaded_on = datetime.utcnow().isoformat() + "Z"

        current_segment = None
        last_timestamp = 0

        for para in doc.paragraphs:
            try:
                text = para.text.strip()
                if not text:
                    continue

                speaker_timestamp_pattern = r'\*\*([^*]+)\*\*:\s*(\d{2}:\d{2})'
                match = re.match(speaker_timestamp_pattern, text)

                if match:
                    if current_segment:
                        segments.append(current_segment)

                    speaker = clean_text(match.group(1))
                    timestamp = match.group(2)
                    start_time = timestamp_to_seconds(timestamp)

                    current_segment = {
                        "segment_id": f"s{len(segments) + 1}",
                        "start_time": start_time,
                        "end_time": start_time + 5,
                        "speaker": speaker,
                        "text": "",
                        "words": []
                    }
                    last_timestamp = start_time
                else:
                    cleaned_text = clean_text(text)
                    
                    if current_segment and cleaned_text:
                        if current_segment["text"]:
                            current_segment["text"] += " " + cleaned_text
                        else:
                            current_segment["text"] = cleaned_text
                        
                        words = cleaned_text.split()
                        word_duration = 5 / len(words) if words else 0
                        
                        for i, word in enumerate(words):
                            current_segment["words"].append({
                                "word": word,
                                "start": last_timestamp + (i * word_duration),
                                "end": last_timestamp + ((i + 1) * word_duration)
                            })
            except Exception as e:
                logger.error(f"Error processing paragraph: {e}")

        if current_segment:
            segments.append(current_segment)

        for i in range(len(segments) - 1):
            segments[i]["end_time"] = segments[i + 1]["start_time"]

        total_duration = segments[-1]["end_time"] if segments else 0

        parsed_data = {
            "project_id": project_id,
            "media": {
                "id": media_id,
                "source": file.filename,
                "duration": total_duration,
                "uploaded_on": uploaded_on
            },
            "transcript": {
                "segments": segments
            },
            "edits": []
        }

        logger.info(f"Parsed {len(segments)} segments from DOCX")
        return parsed_data

    except Exception as e:
        logger.error(f"Error parsing DOCX file: {e}", exc_info=True)
        raise
