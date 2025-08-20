FROM python:3.9-slim

WORKDIR /app
COPY ./ /app/
RUN pip install pika redis python-decouple

CMD ["python", "rmq.py"]
