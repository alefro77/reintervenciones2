import csv
import json
from datetime import datetime, date, time

format = '%d/%m/%Y %I:%M:%S %p'
def dias(x, y):
	return (y-x).days

def putJson(arr, ac, file):
	jsonfile = open(file, 'w')
	jsonfile.write('[')
	z=0
	for k in arr:
		c = arr[k]
		if z == 0:
			tp = ""
		else:
			tp = ","
		z+=1	
		i = 0
		txtPar = '\n  '+tp+'{\n    "id": "' + k + '",\n    "edad": "' + c["edad"] + '",\n    "edad_total": "' + c["edad_total"] + '"'
		txtPar = txtPar + ',\n    "genero":"' + c["genero"] + '",\n    "fuerza":"' + c["fuerza"]
		txtPar = txtPar + '",\n    "reint":' + str(c["reint"]) + ',\n    "cirugias":['
		jsonfile.write(txtPar)
		for ci in c["cirugias"]:
			if i==0:
				ti =""
			else:
				ti = ","
			i+=1	
			tab = "       ";
			cir = ac[ci["id"]]
			txtPar = "\n     "+ti+"{\n"
			txtPar = txtPar + tab + '"fecha": "' + ci["fecha"].strftime(format) + '",\n' + tab + '"daysPast":' + str(ci["dias"])
			txtPar = txtPar + ',\n' + tab + '"tipoAtencion":"' + cir["tipoAtencion"] + '",\n' + tab + '"valorfactura":' + cir["valor"]
			txtPar = txtPar + ',\n' + tab + '"indice":{ "esp":"' + ci["indice"]["esp"] + '", "proc": "' + ci["indice"]["proc"] + '"},\n' + tab + '"procedimientos":['
			jsonfile.write(txtPar)
			ban = ""
			r = 0
			for pro in cir["procedimientos"]:
				if r == 0:
					tr = ""
				else:
					tr = ","
				r+=1		
				ban = pro["especialidad"]
				t2 = "          ";
				jsonfile.write("\n" + t2 + tr + '{"especialidad": "' + pro["especialidad"] + '", "nomProc":"' + pro["nomProc"] + '"}')
			jsonfile.write("\n" + tab + "]")
			jsonfile.write("\n     }")
		jsonfile.write("\n    ]")
		jsonfile.write("\n  }")			
	jsonfile.write('\n]') 
	jsonfile.close()

def putJson2(arr,file):
	jsonfile = open(file, 'w')
	jsonfile.write('[')
	z=0
	for k in arr:
		c = arr[k]
		if z == 0:
			tp = ""
		else:
			tp = ","
		z+=1	
		i = 0
		txtPar = '\n  '+tp+'{\n    "id": "' + k + '",\n    "edad": "' + c["edad"] + '",\n    "edad_total": "' + c["edad_total"] + '"'
		txtPar = txtPar + ',\n    "genero":"' + c["genero"] + '",\n    "fuerza":"' + c["fuerza"]
		txtPar = txtPar + '",\n    "reint":' + str(c["reint"]) + ',\n    "cirugias":['
		jsonfile.write(txtPar)
		for pi in c["newcir"]:
			ci = c["newcir"][pi]
			if i==0:
				ti =""
			else:
				ti = ","
			i+=1	
			tab = "       "
			txtPar = "\n     "+ti+"{\n"
			txtPar = txtPar + tab + '"fecha": "' + ci["fecha"].strftime(format)
			txtPar = txtPar + '",\n' + tab + '"tipoAtencion":"' + ci["tipoAtencion"] + '",\n' + tab + '"valorfactura":' + ci["valor"]
			txtPar = txtPar + ',\n' + tab + '"procedimientos":['
			jsonfile.write(txtPar)
			r = 0
			for pro in ci["proc"]:
				if r == 0:
					tr = ""
				else:
					tr = ","
				r+=1		
				t2 = "          ";
				jsonfile.write("\n" + t2 + tr + '{"especialidad": "' + pro["especialidad"] + '", "nomProc":"' + pro["nomProc"] + '"}')
			jsonfile.write("\n" + tab + "],")
			jsonfile.write('\n' + tab + '"hijas":[')
			t=0
			for hija in ci["hijas"]:
				if t==0:
					ti =""
				else:
					ti = ","
				t+=1	
				tab = "            "
				txtPar = "\n          "+ti+"{\n"
				txtPar = txtPar + tab + '"fecha": "' + hija["fecha"].strftime(format)
				txtPar = txtPar + '",\n' + tab + '"tipoAtencion":"' + hija["tipoAtencion"] + '",\n' + tab + '"valorfactura":' + hija["valor"]
				txtPar = txtPar + ',\n' + tab + '"procedimientos":['
				jsonfile.write(txtPar)
				r = 0
				for pro in hija["proc"]:
					if r == 0:
						tr = ""
					else:
						tr = ","
					r+=1		
					t2 = "               ";
					jsonfile.write("\n" + t2 + tr + '{"especialidad": "' + pro["especialidad"] + '", "nomProc":"' + pro["nomProc"] + '"}')
				jsonfile.write("\n" + tab + "]")
				jsonfile.write("\n          }")
			jsonfile.write("\n       ]")
			jsonfile.write("\n     }")
		jsonfile.write("\n    ]")
		jsonfile.write("\n  }")			
	jsonfile.write('\n]') 
	jsonfile.close()
	
exc = []
eds = ["Menor 20", "Entre 20 y 30", "Entre 30 y 40", "Entre 40 y 50", "Entre 50 y 60", "Mas de 60"]

def calEdad(edad):
	if edad <= 20:
		return eds[0]
	elif edad > 20 and edad <= 30:
		return eds[1]
	elif edad > 30 and edad <= 40:
		return eds[2]
	elif edad > 40 and edad <= 50:
		return eds[3]
	elif edad > 50 and edad <= 60:
		return eds[4]
	else:
		return eds[5]


with open('exc.csv') as f:
    reader = csv.DictReader(f)
    d = list(reader)
    for row in d:
    	exc.append(row["Procedimientos"])
   

with open('data.csv') as f:
    reader = csv.DictReader(f)
    data = list(reader)
k=0
arrTot = {"cirugias": {}, "servicios": [], "procedimientos": {}, "pacientes": {}}
servicios = ["CARDIOLOGIA INTERVENCIONISTA", 
			"CIRUGIA CARDIOVASCULAR", 
			"CIRUGIA DE CABEZA Y CUELLO", 
			"CIRUGIA DE SENO", 
			"CIRUGIA DEL TORAX", 
			"CIRUGIA GENERAL DE TRAUMA Y EMERGENCIA", 
			"CIRUGIA GENERAL PROCEDIMIENTOS",
			"CIRUGIA PEDIATRICA",
			"CIRUGIA VASCULAR Y ANGIOLOGIA",
			"COLOPROCTOLOGIA",
			"NEUROCIRUGIA",
			"UROLOGIA",
			"GINECOLOGIA"
			]
del data[0]

for ds in data:
	if (ds["ESPECIALIDAD"] in servicios and ds["NOMBREPROCEDIMIENTO"] not in exc):
		
		if not ds["NOMBREPROCEDIMIENTO"] in arrTot["procedimientos"]:
			arrTot["procedimientos"][ds["NOMBREPROCEDIMIENTO"]] = ds["ESPECIALIDAD"]
		id = "P" + ds["IDENTIFICADOR"] + ds["FECHAPROC"]
		fc = datetime.strptime(ds["FECHAPROC"].replace(".", ""), format)
		if not id in arrTot["cirugias"]:
			arrTot["cirugias"][id] = {"paciente" : ds["IDENTIFICADOR"], "fecha": fc,  "factura": ds["FACTURA"],  "valor": ds["VR_TOTAL_FACTURA"], "procedimientos": [], "tipoAtencion": ds["TIPOATENCION"]}
			if not ds["IDENTIFICADOR"] in arrTot["pacientes"]:
				arrTot["pacientes"][ds["IDENTIFICADOR"]] = {"cantCir": 0, "cirugias": [], "edad_total": ds["EDAD"], "edad": calEdad(int(ds["EDAD"])), "fuerza": ds["FUERZA"], "genero": ds["GENERO"]}
			arrTot["pacientes"][ds["IDENTIFICADOR"]]["cirugias"].append({"id": id, "fecha": fc})
			arrTot["pacientes"][ds["IDENTIFICADOR"]]["cantCir"]+=1
		arrTot["cirugias"][id]["procedimientos"].append({"especialidad": ds["ESPECIALIDAD"], "nomProc": ds["NOMBREPROCEDIMIENTO"]}) 	
		if(ds["ESPECIALIDAD"] not in arrTot["servicios"]):
			arrTot["servicios"].append(ds["ESPECIALIDAD"])

			


z = 0
arrNew = {}
for k in arrTot["pacientes"]:
	c = arrTot["pacientes"][k]
	c["reint"] = 0
	for j in range(0, len(c["cirugias"])):
		ci = c["cirugias"][j];
		q = arrTot["cirugias"]
		if(j>0):
			d = dias(c["cirugias"][j-1]["fecha"], ci["fecha"])
			ci["dias"]  = d
			if d<=60:
				c["reint"]+=1
		else:
			c["cirugias"][j]["dias"] = 0
		cir = arrTot["cirugias"][ci["id"]]["procedimientos"]
		pros = {}
		for pro in cir:
			if not pro["nomProc"] in pros:
				pros[pro["nomProc"]] = 0
			else:
				pros[pro["nomProc"]]+=1	
		pq = sorted(pros, key=pros.__getitem__)
		ci["indice"] = {"proc": pq[0], "esp": arrTot["procedimientos"][pq[0]]}
	arrNew[k] = c	


				
putJson(arrNew, arrTot["cirugias"], "file.json")					


bor = []
for k in arrNew:
	c = arrNew[k]
	if(c["reint"] == 0):
		bor.append(k)
for b in bor:
	del(arrNew[b])


putJson(arrNew, arrTot["cirugias"], "filePac.json")

def bMom(j,cir):
	while(j > 0):
		if(cir[j-1]["reint"] == "no"):
			return j-1
		j=j-1

def analize(cir, todas):
	cir[0]["reint"] = "no"
	q = len(cir);
	ent = {}
	if q>2:
		a = 1
	cirs = {}
	for j in range(1, q):
		if(cir[j]["dias"] <= 60):
			cir[j]["reint"] = "si"
			if(j==1): 
				cir[j]["mom"] = 0
			else:
				cir[j]["mom"] = bMom(j, cir)
		else:
			cir[j]["reint"] = "no"
	for j in range(0, q):
		cir[j]["proc"] = todas[cir[j]["id"]]["procedimientos"]
		cir[j]["tipoAtencion"] = todas[cir[j]["id"]]["tipoAtencion"]
		cir[j]["valor"] = todas[cir[j]["id"]]["valor"]
		if cir[j]["reint"] == "si":
			if(cir[j]["mom"] not in ent):
				ent[cir[j]["mom"]] = {}
				ent[cir[j]["mom"]]["hijas"] = []
				for z in cir[cir[j]["mom"]]:
					ent[cir[j]["mom"]][z] = cir[cir[j]["mom"]][z]
			ent[cir[j]["mom"]]["hijas"].append(cir[j])
	return ent		
		

for k in arrNew:
	c = arrNew[k]
	t = analize(c["cirugias"],arrTot["cirugias"]);
	del(c["cirugias"]);
	arrNew[k]["newcir"] = t;
	


putJson2(arrNew, "fileDi.json")







		
				
