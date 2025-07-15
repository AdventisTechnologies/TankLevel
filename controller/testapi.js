const TestApi = require('../models/testapi');


const TestApicreatepost = async (req, res) => {
  console.log("🚨 CONTROLLER HIT");
  console.log("BODY:", req.body);

  try {
    const { tank_id, level } = req.body;

    if (!tank_id || !level) {
      return res.status(400).json({ error: 'tank_id and level are required' });
    }

    // ✅ Upsert: Update if exists, insert if not
    const result = await TestApi.findOneAndUpdate(
      { tankid: tank_id },
      { tankid: tank_id, level },
      { new: true, upsert: true } // ⬅️ upsert ensures insert if not exists
    );

    return res.status(201).json({ message: 'Success', result });
  } catch (err) {
    console.error('❌ Error creating/updating equipment:', err);
    return res.status(500).json({ error: err.message });
  }
};



 const TestApiget = async (req, res) => {
  console.log(req.body)
  try {
    const data = await TestApi.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const TestApiupdate = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
     const updateddata = await TestApi.findByIdAndUpdate(id, updates, { new: true });
    if (updateddata) {
      return res.status(200).json({ message: 'Data updated successfully' });
    }
    return res.status(200).json(updateddata);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
 };
const TestApidelete = async (req, res) => {
    try{
        await TestApi.findByIdAndDelete(req.params.id);
      res.status(200).json({message:"Data deleted successfully"});
    }catch(err){
      res.status(400).json({
          err:err
      })
    }
 };


module.exports = {  TestApicreatepost,TestApiget, TestApiupdate, TestApidelete};