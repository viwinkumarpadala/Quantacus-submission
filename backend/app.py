from flask import Flask, request, jsonify
import wikipediaapi
from dotenv import load_dotenv
import os
import openai
import json 

# Load environment variables
load_dotenv()

# Create a Flask application
app = Flask(__name__)

# Initialize Wikipedia API
wiki = wikipediaapi.Wikipedia(
    language='en',
    extract_format=wikipediaapi.ExtractFormat.WIKI,
    user_agent='Viwin-Test'
)

# Set OpenAI API Key
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

openai.api_key = OPENAI_API_KEY


# API Route 1: Get section headings for a given main heading
@app.route('/get_sections', methods=['GET'])
def get_sections():
    main_heading = request.args.get('main_heading')
    page = wiki.page(main_heading)
    sections = [section.title for section in page.sections]
    return jsonify({'sections': sections})


# API Route 2: Generate paraphrased content for a given section
@app.route('/paraphrase_content', methods=['POST'])
def paraphrase_content():
    data = request.json
    main_heading = data['main_heading']
    section_heading = data['section_heading']
    
    try:
        page = wiki.page(main_heading)
        section = page.section_by_title(section_heading)

        # Build formatted text recursively, handling nesting
        def format_section(current_section, level=1):
            text = f"\n{'#' * level} {current_section.title}\n"
            text += current_section.text + "\n"

            for subsection in current_section.sections:
                text += format_section(subsection, level + 1)

            return text

        formatted_text = format_section(section)
        
        # Create JSON-formatted message content
        message_content = json.dumps({"text": formatted_text})

        # Create OpenAI ChatCompletion request
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo-0125",
            response_format={"type": "json_object"},
            messages=[
                {"role": "user", "content": message_content},
                {"role": "system", "content": "Paraphrase the text. Include 'json' in the message."}  # Include 'json' in the system message
            ]
        )

        # Extract the summarized text from the response
        paraphrased_text = response.choices[0].message.content
        paraphrased_content = paraphrased_text
        print(paraphrased_content)
        return jsonify({'paraphrased_content': paraphrased_content})

    except Exception as e:
        return jsonify({'error': f"Error: {str(e)}"})

# API Route 3: Generate summarized content for a given section
@app.route('/summarize_content', methods=['POST'])
def summarize_content():
    data = request.json
    main_heading = data['main_heading']
    section_heading = data['section_heading']
    
    try:
        page = wiki.page(main_heading)
        section = page.section_by_title(section_heading)

        # Build formatted text recursively, handling nesting
        def format_section(current_section, level=1):
            text = f"\n{'#' * level} {current_section.title}\n"
            text += current_section.text + "\n"

            for subsection in current_section.sections:
                text += format_section(subsection, level + 1)

            return text

        formatted_text = format_section(section)
        
        # Create JSON-formatted message content
        message_content = json.dumps({"text": formatted_text})

        # Create OpenAI ChatCompletion request
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo-0125",
            response_format={"type": "json_object"},
            messages=[
                {"role": "user", "content": message_content},
                {"role": "system", "content": "Summarize the text. Include 'json' in the message."}  # Include 'json' in the system message
            ]
        )

        # Extract the summarized text from the response
        summarized_text = response.choices[0].message.content
        summarized_content = summarized_text
        print(summarized_content)
        return jsonify({'summarized_content': summarized_content})

    except Exception as e:
        return jsonify({'error': f"Error: {str(e)}"})


# Route to get the content of a specific section
@app.route('/get_content', methods=['POST'])
def get_content():
    data = request.json
    main_heading = data['main_heading']
    section_heading = data['section_heading']

    try:
        page = wiki.page(main_heading)
        section = page.section_by_title(section_heading)

        # Build formatted text recursively, handling nesting
        def format_section(current_section, level=1):
            text = f"\n{'#' * level} {current_section.title}\n"
            text += current_section.text + "\n"

            for subsection in current_section.sections:
                text += format_section(subsection, level + 1)

            return text

        formatted_text = format_section(section)

        return formatted_text

    except wikipediaapi.exceptions.DisambiguationError as e:
        return jsonify({'error': f"DisambiguationError: {e}"})
    except wikipediaapi.exceptions.PageError as e:
        return jsonify({'error': f"PageError: {e}"})

# Run the Flask application
if __name__ == '__main__':
    app.run(debug=True)
