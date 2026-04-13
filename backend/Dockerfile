# Use an official Python runtime as a base image
FROM python:3.10

# Set the working directory inside the container
WORKDIR /app

# Copy just the requirements file first (for better caching)
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copy the entire FastAPI project to the working directory
COPY . .

# Expose the correct FastAPI port
EXPOSE 3003


# Run the application with proxy headers enabled
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "3003", "--proxy-headers", "--forwarded-allow-ips", "*"]