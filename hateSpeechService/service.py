from flask import Flask, request, Response
from detoxify import Detoxify
import os

app = Flask(__name__)
detoxify = Detoxify('original-small')

@app.route('/', methods=['GET'])
def test():
    args = request.args
    text = args.get("text")
    if text is None:
        return "No text provided, use the 'text' query parameter.", 400
    response = str(detoxify.predict(text)).replace("'", '"')
    return Response(response, mimetype='application/json')

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)