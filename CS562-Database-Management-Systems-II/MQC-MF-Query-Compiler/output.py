import postgresql
from databaseConfig import dbConfig
from prettytable import PrettyTable

selectAttributes = "cust,1_avg_quant,2_avg_quant,3_avg_quant"
groupingVarCount = 3
groupingAttributes = "cust"
fVect = "1_avg_quant,2_avg_quant,3_avg_quant"
predicates = "1.cust = cust and 1.state = 'NY',2.cust = cust and 2.state = 'CT',3.cust = cust and 3.state = 'NJ'"
havingCondition = "1_avg_quant > 2_avg_quant and 1_avg_quant > 3_avg_quant"
MF_Struct = {}
db = postgresql.open(user = dbConfig['user'],password = dbConfig['password'],host = dbConfig['host'],port = dbConfig['port'],database = dbConfig['database'],)

query = db.prepare('SELECT * FROM sales;')


# Output file of Algorithm for MF Query:

predicates = predicates.split(',')
pred_list = []
#here we are splitting predicates by each predicate statement and creating a list to store the parts of teach predicates in a single 2D array
for i in predicates:
	pred_list.append(i.split(' '))
#now we loop through the table to evaluate each grouping variable
for i in range(int(groupingVarCount)+1):
	if i == 0:
		for row in query:
			key = ''
			value = {}    #for the 0th pass of the algorithm, it initializes the MF Struct for every unique group based on the grouping variables. The loop iterates over each row as well.
			for attr in groupingAttributes.split(','):
				key += f'{str(row[attr])},'
			key = key[:-1] #Removing the trailing comma form the ky string
			if key not in MF_Struct.keys():
				for groupAttr in groupingAttributes.split(','): #it initializes the columns of the MF Struct row for the grouping attributes
					colVal = row[groupAttr]
					if colVal:
						value[groupAttr] = colVal
				for fVectAttr in fVect.split(','):
                    #for average, a dictonary of sum, count, and avg is created
					if (fVectAttr.split('_')[1] == 'avg'):
						value[fVectAttr] = {'sum':0, 'count':0, 'avg':0}
					elif (fVectAttr.split('_')[1] == 'min'):
                    # we will be initializing min = 4994 as it is the largest value of "quant" in th sales table
						value[fVectAttr] = 4994
					else:
                    #all the other aggregates i.e. sum, count and max will be initialised to 0
						value[fVectAttr] = 0
				MF_Struct[key] = value
	else:
        # now all other n passes for each of the grouping variable
		for aggregate in fVect.split(','):
			agg_list = aggregate.split('_')
			groupVar = agg_list[0] # stores the grouping variable number
			agg_func = agg_list[1] # stores the aggregate function name
			agg_col = agg_list[2] # stores the column name on which the aggregate function is applied
            #Checking if the current iteration i matches the grouping variable number (int(groupVar)). This ensures that the calculations are performed only for the appropriate grouping variable.
            # Also loop through every key in the MF_Struct to update every row of the MF_Struct the predicate statments apply to(1.state = state and 1.cust = cust vs 1.state = state)
			if i == int(groupVar):
				for row in query:
					for key in MF_Struct.keys():
						if agg_func == 'sum':
							eval_string = predicates[i-1]
                            # Creates a string to be run with the eval() method by replacing grouping variables with their actual values
                            # it must also check if the string is a grouping variable and replace that with the actual value from the table row as well
							for string in pred_list[i-1]:
								if len(string.split('.')) > 1 and string.split('.')[0] == str(i):
                                    #if the first part of the string matches the current grouping variable number(i)
									rowVal = row[string.split('.')[1]]
									try:
										int(rowVal)
										eval_string = eval_string.replace(string, str(rowVal))
									except:
										eval_string = eval_string.replace(string, f"'{rowVal}'")
								elif string in groupingAttributes.split(','):
									rowVal = MF_Struct[key][string]
									try:
										int(rowVal)
										eval_string = eval_string.replace(string, str(rowVal))
									except:
										eval_string = eval_string.replace(string, f"'{rowVal}'") #if the conversion to an integer in the previous step raises an exception (i.e., row_val is not numeric), it means it's a string value. In this case, the occurrence of string in the evaluation string is replaced with row_val surrounded by single quotes, creating a string representation.
                            # if eval_string is true, update the sum
							if eval(eval_string.replace('=', '==')):
								sum = int(row[agg_col])
								MF_Struct[key][aggregate] += sum
						elif agg_func == 'avg':
							sum = MF_Struct[key][aggregate]['sum']
							count = MF_Struct[key][aggregate]['count']
							eval_string = predicates[i-1]
							for string in pred_list[i-1]:
								if len(string.split('.')) > 1 and string.split('.')[0] == str(i):
									rowVal = row[string.split('.')[1]]
									try:
										int(rowVal)
										eval_string = eval_string.replace(string, str(rowVal))
									except:
										eval_string = eval_string.replace(string, f"'{rowVal}'")
								elif string in groupingAttributes.split(','):
									rowVal = MF_Struct[key][string]
									try:
										int(rowVal)
										eval_string = eval_string.replace(string, str(rowVal))
									except:
										eval_string = eval_string.replace(string, f"'{rowVal}'")
                            # If eval_string is true and count isn't 0, update the avg
							if eval(eval_string.replace('=', '==')):
								sum += int(row[agg_col])
								count += 1
								if count != 0:
									MF_Struct[key][aggregate] = {'sum': sum, 'count': count, 'avg': (sum/count)}
						elif agg_func == 'min':
							eval_string = predicates[i-1]
							for string in pred_list[i-1]:
								if len(string.split('.')) > 1 and string.split('.')[0] == str(i):
									rowVal = row[string.split('.')[1]]
									try:
										int(rowVal)
										eval_string = eval_string.replace(string, str(rowVal))
									except:
										eval_string = eval_string.replace(string, f"'{rowVal}'")
								elif string in groupingAttributes.split(','):
									rowVal = MF_Struct[key][string]
									try:
										int(rowVal)
										eval_string = eval_string.replace(string, str(rowVal))
									except:
										eval_string = eval_string.replace(string, f"'{rowVal}'")
                            # If eval_string is true, update the min
							if eval(eval_string.replace('=', '==')):
								min = int(MF_Struct[key][aggregate])
								if int(row[agg_col]) < min:
									MF_Struct[key][aggregate] = row[agg_col]
						elif agg_func == 'max':
							eval_string = predicates[i-1]
							for string in pred_list[i-1]:
								if len(string.split('.')) > 1 and string.split('.')[0] == str(i):
									rowVal = row[string.split('.')[1]]
									try:
										int(rowVal)
										valString = eval_string.replace(string, str(rowVal))
									except:
										eval_string = eval_string.replace(string, f"'{rowVal}'")
								elif string in groupingAttributes.split(','):
									rowVal = MF_Struct[key][string]
									try:
										int(rowVal)
										valString = eval_string.replace(string, str(rowVal))
									except:
										eval_string = eval_string.replace(string, f"'{rowVal}'")
                            # If eval_string is true, update the max
							if eval(eval_string.replace('=', '==')):
								max = int(MF_Struct[key][aggregate])
								if int(row[agg_col]) > max:
									MF_Struct[key][aggregate] = row[agg_col]
						elif agg_func == 'count':
							eval_string = predicates[i-1]
							for string in pred_list[i-1]:
								if len(string.split('.')) > 1 and string.split('.')[0] == str(i):
									rowVal = row[string.split('.')[1]]
									try:
										int(rowVal)
										eval_string = eval_string.replace(string, str(rowVal))
									except:
										eval_string = eval_string.replace(string, f"'{rowVal}'")
								elif string in groupingAttributes.split(','):
									rowVal = MF_Struct[key][string]
									try:
										int(rowVal)
										eval_string = eval_string.replace(string, str(rowVal))
									except:
										eval_string = eval_string.replace(string, f"'{rowVal}'")
                            # If eval_string is true, increment the count
							if eval(eval_string.replace('=', '==')):
								MF_Struct[key][aggregate] += 1
#checking the HAVING condition and generating output table
output = PrettyTable()
output.field_names = selectAttributes.split(',')
for row in MF_Struct:
    #create an eval_string to be used to check each having condition
	eval_string = ''
	if havingCondition != '':
		for string in havingCondition.split(' '):
            #if there is a having condition, loop through each element of the having condition to fill in the correct information into the eval_string
            #the eval string will be equal to the having condition, replaced with the values of the variables in question, 
            #then evaluated to check if the row of the MFStruct being examined is to be included in the output table
			if string not in ['>', '<', '==', '<=', '>=', 'and', 'or', 'not', '*', '/', '+', '-']:
				try:
					float(string)
					eval_string += string
				except:
					if len(string.split('_')) > 1 and string.split('_')[1] == 'avg':
						eval_string += str(MF_Struct[row][string]['avg'])
					else:
						eval_string += str(MF_Struct[row][string])
			else:
				eval_string += f' {string} '
		if eval(eval_string.replace('=', '==')):
			row_info = []
            #we check if there are any operators in select attributes or not, if yes, use them or else run normally
			for val in selectAttributes.split(','):
				if len(val.split('_')) > 1 and val.split('_')[1] == 'sum':
					if '/' in val:
						num1, num2 = val.split('/')
						result = eval(f"MF_Struct[row][num1]/ MF_Struct[row][num2]")
						row_info.append(str(result))
					elif '+' in val:
						num1, num2 = val.split('+')
						result = eval(f"MF_Struct[row][num1]+ MF_Struct[row][num2]")
						row_info.append(str(result))
					elif '-' in val:
						num1, num2 = val.split('-')
						result = eval(f"MF_Struct[row][num1]- MF_Struct[row][num2]")
						row_info.append(str(result))
					elif '*' in val:
						num1, num2 = val.split('*')
						result = eval(f"MF_Struct[row][num1]* MF_Struct[row][num2]")
						row_info.append(str(result))
					else:
						row_info += [str(MF_Struct[row][val])]
				elif len(val.split('_')) > 1 and val.split('_')[1] == 'avg':
					if '/' in val:
						num1, num2 = val.split('/')
						result = eval(f"MF_Struct[row][num1]/ MF_Struct[row][num2]")
						row_info.append(str(result))
					elif '+' in val:
						num1, num2 = val.split('+')
						result = eval(f"MF_Struct[row][num1]+ MF_Struct[row][num2]")
						row_info.append(str(result))
					elif '-' in val:
						num1, num2 = val.split('-')
						result = eval(f"MF_Struct[row][num1]- MF_Struct[row][num2]")
						row_info.append(str(result))
					elif '*' in val:
						num1, num2 = val.split('*')
						result = eval(f"MF_Struct[row][num1]* MF_Struct[row][num2]")
						row_info.append(str(result))
					else:
						row_info += [str(MF_Struct[row][val]['avg'])]
				elif len(val.split('_')) > 1 and val.split('_')[1] == 'min':
					if '/' in val:
						num1, num2 = val.split('/')
						result = eval(f"MF_Struct[row][num1]/ MF_Struct[row][num2]")
						row_info.append(str(result))
					elif '+' in val:
						num1, num2 = val.split('+')
						result = eval(f"MF_Struct[row][num1]+ MF_Struct[row][num2]")
						row_info.append(str(result))
					elif '-' in val:
						num1, num2 = val.split('-')
						result = eval(f"MF_Struct[row][num1]- MF_Struct[row][num2]")
						row_info.append(str(result))
					elif '*' in val:
						num1, num2 = val.split('*')
						result = eval(f"MF_Struct[row][num1]* MF_Struct[row][num2]")
						row_info.append(str(result))
					else:
						row_info += [str(MF_Struct[row][val])]
				elif len(val.split('_')) > 1 and val.split('_')[1] == 'max':
					if '/' in val:
						num1, num2 = val.split('/')
						result = eval(f"MF_Struct[row][num1]/ MF_Struct[row][num2]")
						row_info.append(str(result))
					elif '+' in val:
						num1, num2 = val.split('+')
						result = eval(f"MF_Struct[row][num1]+ MF_Struct[row][num2]")
						row_info.append(str(result))
					elif '-' in val:
						num1, num2 = val.split('-')
						result = eval(f"MF_Struct[row][num1]- MF_Struct[row][num2]")
						row_info.append(str(result))
					elif '*' in val:
						num1, num2 = val.split('*')
						result = eval(f"MF_Struct[row][num1]* MF_Struct[row][num2]")
						row_info.append(str(result))
					else:
						row_info += [str(MF_Struct[row][val])]
				elif len(val.split('_')) > 1 and val.split('_')[1] == 'count':
					if '/' in val:
						num1, num2 = val.split('/')
						result = eval(f"MF_Struct[row][num1]/ MF_Struct[row][num2]")
						row_info.append(str(result))
					elif '+' in val:
						num1, num2 = val.split('+')
						result = eval(f"MF_Struct[row][num1]+ MF_Struct[row][num2]")
						row_info.append(str(result))
					elif '-' in val:
						num1, num2 = val.split('-')
						result = eval(f"MF_Struct[row][num1]- MF_Struct[row][num2]")
						row_info.append(str(result))
					elif '*' in val:
						num1, num2 = val.split('*')
						result = eval(f"MF_Struct[row][num1]* MF_Struct[row][num2]")
						row_info.append(str(result))
					else:
						row_info += [str(MF_Struct[row][val])]
				else:
					row_info += [str(MF_Struct[row][val])]
			output.add_row(row_info)
		eval_string = ''
	else:
        #there is no having condition, thus every MFStruct row will be added to the output table
		row_info = []
		for val in selectAttributes.split(','):
			if len(val.split('_')) > 1 and val.split('_')[1] == 'sum':
				if '/' in val:
					num1, num2 = val.split('/')
					result = eval(f"MF_Struct[row][num1]/ MF_Struct[row][num2]")
					row_info.append(str(result))
				elif '+' in val:
					num1, num2 = val.split('+')
					result = eval(f"MF_Struct[row][num1]+ MF_Struct[row][num2]")
					row_info.append(str(result))
				elif '-' in val:
					num1, num2 = val.split('-')
					result = eval(f"MF_Struct[row][num1]- MF_Struct[row][num2]")
					row_info.append(str(result))
				elif '*' in val:
					num1, num2 = val.split('*')
					result = eval(f"MF_Struct[row][num1]* MF_Struct[row][num2]")
					row_info.append(str(result))
				else:
					row_info += [str(MF_Struct[row][val])]
			elif len(val.split('_')) > 1 and val.split('_')[1] == 'avg':
				if '/' in val:
					num1, num2 = val.split('/')
					result = eval(f"MF_Struct[row][num1]/ MF_Struct[row][num2]")
					row_info.append(str(result))
				elif '+' in val:
					num1, num2 = val.split('+')
					result = eval(f"MF_Struct[row][num1]+ MF_Struct[row][num2]")
					row_info.append(str(result))
				elif '-' in val:
					num1, num2 = val.split('-')
					result = eval(f"MF_Struct[row][num1]- MF_Struct[row][num2]")
					row_info.append(str(result))
				elif '*' in val:
					num1, num2 = val.split('*')
					result = eval(f"MF_Struct[row][num1]* MF_Struct[row][num2]")
					row_info.append(str(result))
				else:
					row_info += [str(MF_Struct[row][val]['avg'])]
			elif len(val.split('_')) > 1 and val.split('_')[1] == 'min':
				if '/' in val:
					num1, num2 = val.split('/')
					result = eval(f"MF_Struct[row][num1]/ MF_Struct[row][num2]")
					row_info.append(str(result))
				elif '+' in val:
					num1, num2 = val.split('+')
					result = eval(f"MF_Struct[row][num1]+ MF_Struct[row][num2]")
					row_info.append(str(result))
				elif '-' in val:
					num1, num2 = val.split('-')
					result = eval(f"MF_Struct[row][num1]- MF_Struct[row][num2]")
					row_info.append(str(result))
				elif '*' in val:
					num1, num2 = val.split('*')
					result = eval(f"MF_Struct[row][num1]* MF_Struct[row][num2]")
					row_info.append(str(result))
				else:
					row_info += [str(MF_Struct[row][val])]
			elif len(val.split('_')) > 1 and val.split('_')[1] == 'max':
				if '/' in val:
					num1, num2 = val.split('/')
					result = eval(f"MF_Struct[row][num1]/ MF_Struct[row][num2]")
					row_info.append(str(result))
				elif '+' in val:
					num1, num2 = val.split('+')
					result = eval(f"MF_Struct[row][num1]+ MF_Struct[row][num2]")
					row_info.append(str(result))
				elif '-' in val:
					num1, num2 = val.split('-')
					result = eval(f"MF_Struct[row][num1]- MF_Struct[row][num2]")
					row_info.append(str(result))
				elif '*' in val:
					num1, num2 = val.split('*')
					result = eval(f"MF_Struct[row][num1]* MF_Struct[row][num2]")
					row_info.append(str(result))
				else:
					row_info += [str(MF_Struct[row][val])]
			elif len(val.split('_')) > 1 and val.split('_')[1] == 'count':
				if '/' in val:
					num1, num2 = val.split('/')
					result = eval(f"MF_Struct[row][num1]/ MF_Struct[row][num2]")
					row_info.append(str(result))
				elif '+' in val:
					num1, num2 = val.split('+')
					result = eval(f"MF_Struct[row][num1]+ MF_Struct[row][num2]")
					row_info.append(str(result))
				elif '-' in val:
					num1, num2 = val.split('-')
					result = eval(f"MF_Struct[row][num1]- MF_Struct[row][num2]")
					row_info.append(str(result))
				elif '*' in val:
					num1, num2 = val.split('*')
					result = eval(f"MF_Struct[row][num1]* MF_Struct[row][num2]")
					row_info.append(str(result))
				else:
					row_info += [str(MF_Struct[row][val])]
			else:
				row_info += [str(MF_Struct[row][val])]
		output.add_row(row_info)
print(output)

