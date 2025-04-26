//Print all data in covid stats
db.getCollection("Covid Stats").find({})
//count the results returned
db.getCollection("Covid Stats").find({}).itcount()

//query data for country_id is 1
db.getCollection("Covid Stats").find({'country_id':1})

//where country_id is 1 update the total_new_deaths to their average
//get average of total_new_deaths for country_id is 1 over the years
//declare variable
const result= 0;
//save result in variable
result=db.getCollection("Covid Stats").aggregate([
  {$match: { country_id: 1 }},
  {$group: {_id: "$country_id",avgDeaths: { $avg: "$total_new_deaths" }}}]).toArray()
 
//save in variable
const avg_daeths_country1 = result[0].avgDeaths;
//update the country
db.getCollection('Covid Stats').updateMany(
{country_id:1},
{$set:{total_new_deaths:avg_daeths_country1}}
)
//get the update records
db.getCollection('Covid Stats').find({country_id:1});


