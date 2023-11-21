# TaskBoard

TaskBoard is an application that allows you to manage tasks efficiently. This app is built with FastAPI and JS.

## Getting started 🚀

These instructions will allow you to obtain a copy of the project on your local machine for development and testing purposes.

### Prerequisites 📋

You will need to have Python and pip installed on your machine. You can download Python [here](https://www.python.org/downloads/) and pip will be installed with Python.

### Installation of the site, api and its dependencies🔧

1. Clone the repository to your local machine:
git clone https://github.com/MaxAlgavaBernabe/TaskBoard.git


2. Navigate to the project directory:
cd api-env

3. Create a virtual Python environment:
python -m venv venv


4. Activate the virtual environment:

On Windows:
.\venv\Scripts\activate


On Unix or MacOS:
source venv/bin/activate


5. Install the project dependencies:
pip install -r requirements.txt


6. Run the application (inside the main.py folder):
uvicorn main:app --reload


You should now be able to see the api running on `http://127.0.0.1:8000/`.
##To run the front
Once you run the api, to see the front of the site I suggest you use the "live Server" visual code extension
## Running the api tests⚙️

example


## Built with 🛠️

* [FastAPI](https://fastapi.tiangolo.com/) - The web framework used
* [Python](https://www.python.org/) - Programming Language as Back-End
* [JavaScript](https://developer.mozilla.org/es/docs/Web/JavaScript) - Programming language as Front-End

## Authors ✒️

* **Max Algava Bernabe** - *Initial Work* - [MaxAlgavaBernabe](https://github.com/MaxAlgavaBernabe)
