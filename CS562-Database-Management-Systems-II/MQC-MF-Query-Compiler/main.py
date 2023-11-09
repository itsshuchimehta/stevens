import postgresql
from databaseConfig import dbConfig
from mfQueries import mf_Query
import subprocess
import psycopg2

# Create connection to database
try:
    db = postgresql.open(
        user = dbConfig["user"],
        password = dbConfig["password"],
        host = dbConfig["host"],
        port = dbConfig["port"],
        database = dbConfig["database"],
    )   
except(Exception, psycopg2.Error) as error:
    print("Error connecting to PostgreSQL database ==>", error)
    exit()

# Receive Input
inputType = input("Please enter the File Name which you would like to read : ")
selectAttributes = ""
groupingVarCount = ""
groupingAttributes = ""
fVect = ""
predicates = ""
having_condition = ""

if inputType != "":

    try:
        with open(inputType) as f:
            content = f.readlines()
        content = [x.rstrip() for x in content]
        i = 0
        while i < len(content):
            if(content[i] == "SELECT ATTRIBUTE(S):"):
                i += 1
                selectAttributes = content[i].replace(" ", "")
                i += 1
            elif(content[i] == "NUMBER OF GROUPING VARIABLES(n):"):
                i += 1
                groupingVarCount = content[i].replace(" ", "")
                i += 1
            elif(content[i] == "GROUPING ATTRIBUTES(V):"):
                i += 1
                groupingAttributes = content[i].replace(" ", "")
                i += 1
            elif(content[i] == "F-VECT([F]):"):
                i += 1
                fVect = content[i].replace(" ", "")
                i += 1
            elif(content[i] == "SELECT CONDITION-VECT([σ]):"):
                i += 1
                predicates = content[i]
                i += 1
            elif(content[i] == "HAVING_CONDITION(G):"): 
                i += 1     
                having_condition = content[i]
                i += 1
            else:
                predicates += "," + content[i]
                i += 1
        #trim input of whitespace
        selectAttributes = selectAttributes.replace(" ", "")
        groupingVarCount = groupingVarCount.replace(" ", "")
        groupingAttributes = groupingAttributes.replace(" ", "")
        fVect = fVect.replace(" ", "")
        predicates = predicates #white space needed to evaluate each predicate statment 
        having_condition = having_condition #white space needed to evaluate each having condition
   
    except(Exception):
        print("Error : Please Enter Valid File Name!")
        exit()
else:
    print("Please Provide File Name!")
    subprocess.run(["python3", "main.py"])

#initalizing outputfile with needed modules, database connection, input variables, and empty MF Struct
with open('output.py', 'w') as outputfile: # opens file to write algorithm to
    outputfile.write("import postgresql\nfrom databaseConfig import dbConfig\nfrom prettytable import PrettyTable\n\n") #import modules
    outputfile.write(f"""selectAttributes = "{selectAttributes}"\ngroupingVarCount = {groupingVarCount}\ngroupingAttributes = "{groupingAttributes}"\nfVect = "{fVect}"\npredicates = "{predicates}"\nhavingCondition = "{having_condition}"\n""") #write input variables to file
    outputfile.write("MF_Struct = {}\n") #initalize empty MF Struct
    outputfile.write("db = postgresql.open(user = dbConfig['user'],password = dbConfig['password'],host = dbConfig['host'],port = dbConfig['port'],database = dbConfig['database'],)\n\n")
    outputfile.write("query = db.prepare('SELECT * FROM sales;')\n") #connect to DB and query sales table to loop through row by row during evaluation of MF Struct
    
#initializing mfQuery outputfile
    outputfile.write("\n\n# Output file of Algorithm for MF Query:\n")
    outputfile.close()
    mf_Query() #calls mfQuery function to write the appropriate algorithm to the output.py file
db.close()
subprocess.run(["python3", "output.py"])