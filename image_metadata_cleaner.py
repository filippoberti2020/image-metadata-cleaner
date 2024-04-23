from flask import Flask, render_template, request,  send_file
import os
from PIL import Image

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    uploaded_files = request.files.getlist("image")
    cleaned_files = []

    for file in uploaded_files:
        img = Image.open(file)
        img_data = list(img.getdata())
        img_no_exif = Image.new(img.mode, img.size)
        img_no_exif.putdata(img_data)

        # Get the file extension from the uploaded file's name
        ext = file.filename.split('.')[-1].lower()

        # Create a new file name with a prefix "cleaned_"
        new_filename = f"cleaned_{file.filename}"

        # Save the image with the specified file extension and the new file name
        img_no_exif.save(new_filename, format=ext)

        cleaned_files.append(new_filename)

    return render_template('download.html', files=cleaned_files)

@app.route('/download/<path:filename>')
def download(filename):
    return send_file(filename, as_attachment=True)


if __name__ == '__main__':
    app.run(debug=True)
