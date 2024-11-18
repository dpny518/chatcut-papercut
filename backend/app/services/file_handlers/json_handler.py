import json

async def parse(content):
    data = json.loads(content)
    # Assuming the JSON is already in a format we can use
    return [{"text": item['text']} for item in data.get('transcript', [])]