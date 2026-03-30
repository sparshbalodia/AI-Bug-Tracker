import os
import json
from groq import Groq


def enhance_issue(title, description):
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))

    prompt = f"""
    Analyze this bug report:

    Title: {title}
    Description: {description}

    Return ONLY valid JSON:
    {{
      "severity": "low|medium|high",
      "repro_steps": ["step1", "step2"],
      "possible_cause": "string"
    }}
    """

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )

        text = response.choices[0].message.content
        return json.loads(text)

    except Exception:
        return {
            "severity": "medium",
            "repro_steps": ["Open app", "Perform action"],
            "possible_cause": "Unknown error"
        }