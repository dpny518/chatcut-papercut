import re
from datetime import timedelta
import logging

logger = logging.getLogger(__name__)

def parse_time(time_str):
    hours, minutes, seconds_ms = time_str.split(':')
    seconds, milliseconds = seconds_ms.split(',')
    return timedelta(hours=int(hours), minutes=int(minutes), seconds=int(seconds), milliseconds=int(milliseconds))

async def parse(content):
    logger.info("Starting SRTX parsing")
    content = content.decode('utf-8')
    logger.info(f"First 200 characters of content: {content[:200]}")
    
    # Updated pattern to match the format in your file
    pattern = re.compile(r'(\d+)\n(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})\n(.+?)\n(.*?)(?=\n\n|\Z)', re.DOTALL)
    matches = pattern.findall(content)

    logger.info(f"Found {len(matches)} matches in SRTX content")

    parsed_content = []
    for match in matches:
        index, start_time, end_time, speaker, text = match
        start = parse_time(start_time)
        end = parse_time(end_time)
        
        parsed_content.append({
            "index": int(index),
            "start_time": start.total_seconds(),
            "end_time": end.total_seconds(),
            "text": text.strip(),
            "speaker": speaker.strip()
        })

    logger.info(f"Parsed {len(parsed_content)} segments from SRTX")
    return parsed_content