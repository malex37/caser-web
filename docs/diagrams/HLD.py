import os

from diagrams import Diagram, Cluster, Edge
from diagrams.aws.database import Dynamodb
from diagrams.aws.storage import S3
from diagrams.aws.security import Cognito
from diagrams.custom import Custom
from diagrams.programming.framework import React
from diagrams.programming.language import Typescript as TS
from diagrams.generic.storage import Storage

# C4
from diagrams.c4 import Container

with Diagram(name="High level diagram",
             show=True,
             filename="./docs/diagrams/renders/HLD",
             direction="TB"
             ):

    with Cluster("Cloud services"):
        with Cluster("Data storage"):
            usersDb = Dynamodb(label="Users")
            tasksDb = Dynamodb(label="Tasks")
            boardsDb = Dynamodb(label="Boards")
            taskDocs = S3(label="Attached files")
            completed = S3(label="Completed boards/tasks")

        with Cluster("Identity"):
            userPool = Cognito(label="User auth pool")
            accessControl = Container(name="User permissions")

    with Cluster("Server side actions"):
        with Cluster("Data fetching"):
            # permissions, authz and authn
            authAction = TS("Authenticate")
            registerUser = TS("User sign-up")
            # Boards and ux
            getBoards = TS("GetBoards")
            getTasks = TS("GetTasks")
            getUser = TS("GetUser")
            listAttachedFiles = TS("ListAttachedFilesForBoard")

        with Cluster("Data writing"):
            createTask = TS("CreateTask")
            addUserToBoard = TS("AddUser")
            updateTask = TS("UpdateTask")

            createTask >> Edge(color="red") >> [tasksDb, boardsDb]
            updateTask >> completed

        getBoards >> boardsDb
        getTasks >> tasksDb
        getUser >> usersDb
        listAttachedFiles >> taskDocs
        addUserToBoard >> Edge(color="red") >> [boardsDb, usersDb]

    with Cluster("Server"):
        with Cluster("Middleware"):
            credMid = TS("Validate credentials")
            sessMid = TS("Confirm session")

        tServer = Custom("Tickety Server", os.getcwd() +
                         "/docs/diagrams/assets/next-js-icon.png")
        with Cluster("Session components"):
            sessionInstance = Storage(label="Session management")
            sessionController = Container(name="Session Controller")

        tServer >> sessMid >> sessionController >> sessionInstance
        tServer >> credMid >> sessionController >> sessionInstance

    tClient = React(label="Client")

    tClient >> tServer
    # data fetchng
    tServer >> [
        authAction,
        getBoards,
        getTasks,
        getUser,
        registerUser,
        listAttachedFiles
    ]
    # data writing
    authAction >> userPool
    registerUser >> userPool
    tServer >> [createTask]
    tServer >> updateTask
    updateTask >> tasksDb
    updateTask >> boardsDb

    # DB relationships
    tasksDb - Edge(style="dashed") - taskDocs
    tasksDb - Edge(style="dashed") - usersDb
    tasksDb - Edge(style="dashed") - boardsDb
