FROM python:3.11-slim-buster

WORKDIR /backend

COPY requirements.txt /backend/requirements.txt

RUN pip3 install -r requirements.txt

COPY . /backend/

EXPOSE 4002

CMD python manage.py runserver
