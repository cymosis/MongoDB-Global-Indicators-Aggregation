//update column name id_row in Mental health
db.getCollection('Mental Health Country').find();
//update column name id_row to country_id
db.getCollection('Mental Health Country').updateMany(
{},
{$rename:{'id_row':'country_id'}}
);
//get the new column names
Object.keys(db.getCollection('Mental Health Country').findOne());

//now joining all the collections
db.getCollection("Covid Stats").aggregate([
// Join All Country Metrics
  {$lookup: {
      from: "All Country Metrics",
      localField: "country_id",
      foreignField: "country_id",
      as: "metrics_data"}
  },
  { $unwind: "$metrics_data" },
 // Join Doctor Patient
  {
    $lookup: {
      from: "Doctor Patient",
      localField: "country_id",
      foreignField: "country_id",
      as: "doctor_data"
    }
  },
  { $unwind: "$doctor_data" },
//Join Mental Health Country
  {
    $lookup: {
      from: "Mental Health Country",
      localField: "country_id",
      foreignField: "country_id",
      as: "mental_health_data"
    }
  },
  { $unwind: "$mental_health_data" },

 //Remove _id to avoid confilcts during merging
  {
    $unset: [
      "_id",
      "metrics_data._id",
      "doctor_data._id",
      "mental_health_data._id"
    ]
  },

 //Write into a new collection
  {
    $out: "All Global Summary"
  }

], { allowDiskUse: true });

//Grouping per country and year
db.getCollection("All Global Summary").aggregate([
  {
    $group: {
      _id: { report_year: "$report_year", 
          country_id: "$country_id" },
      documents: { $push: "$$ROOT" }
    }
  }
]);


// time duration to query detailed of a country and its year
const start = new Date();

const result = db.getCollection("All Global Summary")
.find({
  report_year: 2021,
  country_id: 9
}).toArray();

const end = new Date();
const durationMs = end - start;

print(`Returned ${result.length} 
documents in ${durationMs} ms`);
result.forEach(doc => {
  printjson(doc);
});






























