# Use slim Python 3.9 base image
FROM python:3.9-slim

# Set working directory inside the container
WORKDIR /app

# Copy only requirement file first to cache Docker layer
COPY requirements.txt .

# Install dependencies
RUN pip install -r requirements.txt

# Copy the rest of your app code
COPY . .

# Ensure you have a writable temp directory (under /app)
RUN mkdir -p /app/temp

# Expose the port your app will run on
EXPOSE 5000

# Start the Flask app
CMD ["python", "app.py"]

