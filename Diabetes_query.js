//Diabetes
const count_insured= db.getCollection('Diabetes Transform').
find({insurance_coverage:"Insurance covered"}).count();
print("Count of insured individuals: " + count_insured);


db.getCollection("Diabetes Transform").aggregate([
  {$group: {_id: {insurance: "$insurance_coverage",
      diabetes_status: "$diabetes_description"},
      count: { $sum: 1 }}}
]);


//percantage
db.getCollection("Diabetes Transform").aggregate([
  // Match only those with insurance coverage
  { $match: { insurance_coverage: "Insurance covered" } },
  // Group by insurance coverage and diabetes status, then count
  { $group: {
    _id: { insurance: "$insurance_coverage", diabetes_status: "$diabetes_description" },
    count: { $sum: 1 }
  }},
  // Calculate the ratio of count to count_insured
  { $project: {
    insurance_coverage: "$_id.insurance",
    diabetes_status: "$_id.diabetes_status",
    count: 1,
    percentage: {
      $multiply: [{ $divide: ["$count", count_insured] }, 100]
    }
  }}
]);


