# Reintervenciones

El proyecto parte del dataset (data.csv). Procedimientos realizados en el hospital militar desde el año 2012. El dataset inicialmente se procesa con el archivo npass.py con las siguientes condiciones

  -Una intervención son los procedimientos que se realizan exactamente en la misma fecha y hora
  -Una reinervención corresponde a una nueva intervención en un periodo máximo de 60 días al mismo paciente.
  -Cada intervención puede tener varios procedimientos y especialidades. Sin embargo si existe una nueva inervención con la condición anterior, a cada procedimiento interveniente se le suma una intervención.
  -Se filtran algunos procedimientos descritos en el archivo ex.csv
  -Las especialidades que se siguen estan definidas en el archivo npass.py
 
Este proyecto de visualización buscar realizar especialmente las siguientes tareas
  -Presentar por cada servicio la cantidad de reintervenciones generadas en periodos de tiempo o acumulados y sus costos asociados
  -Comparar el riesgo dadas las características de un paciente, de tener reintervenciones quirúrgicas a partir del tipo de procedimiento realizado

La visualización consta de 3 Idioms, un scatterplot con la posición vertical para el costo de las reintervenciones y posición horizontal para la cantidad de reintervenciones. Todas pueden ser filtradas de acuerdo al año de interés.

Posteriormente se presenta un Icicle Treemap ordenable por las características de edad (rango de edad), género y fuerza. Con la selección de cualquiera de las areas dentro del Treemap, se filtran los procedimientos en un bubble chart cuya area identifica el número de reintervenciones. Al paso del mouse por los circulos del chart se muestra en detalle la cantidad y la especialidad a la que pertencen.

Las visualizaciones generan los siguientes insights
  - Las  


