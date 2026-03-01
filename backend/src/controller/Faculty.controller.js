import cloudinary from '../config/Cloudinary.js';
import Faculty from '../models/Faculty.model.js';

export const addFaculty = async (req, res) => {
  try {
    const {
      facultyName,
      designation,
      qualification,
      totalExperience,
      imageUrl,
      email,
      phoneNumber,
      department,
    } = req.body;

    const uploadImage = await cloudinary.uploader.upload(imageUrl, {
      folder: 'faculty_images',
    });

    const newFaculty = new Faculty({
      facultyName,
      designation,
      qualification,
      totalExperience,
      imageUrl: uploadImage.secure_url,
      email,
      phoneNumber,
      department,
    });

    await newFaculty.save();
    res.status(201).json({ message: 'Faculty added successfully', faculty: newFaculty });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err);
  }
};

export const getAllFaculties = async (req, res) => {
  try {
    const faculties = await Faculty.find();
    res.status(200).json({ faculties });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err);
  }
};

export const getFacultyById = async (req, res) => {
  try {
    const { id } = req.params;
    const faculty = await Faculty.findById(id);
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }
    res.status(200).json({ faculty });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err);
  }
};

export const deleteFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFaculty = await Faculty.findByIdAndDelete(id);
    if (!deletedFaculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }
    res.status(200).json({ message: 'Faculty deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err);
  }
};


export const updateFaculty=async(req,res)=>{
  try{
    const {id}=req.params;
    const {
      facultyName,
      designation,
      qualification,
      totalExperience,
      imageUrl,
      email,
      phoneNumber,
      department,
    } = req.body;

    if(imageUrl){
      const uploadImage = await cloudinary.uploader.upload(imageUrl, {
        folder: 'faculty_images',
      });
      imageUrl=uploadImage.secure_url;
    }

    const updatedFaculty = await Faculty.findByIdAndUpdate(id, {
      facultyName,
      designation,
      qualification,
      totalExperience,
      imageUrl,
      email,
      phoneNumber,
      department,
    }, { new: true });

    if (!updatedFaculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    res.status(200).json({ message: 'Faculty updated successfully', faculty: updatedFaculty });
  }catch(err){
    res.status(500).json({ message: err.message });
    console.log(err);
  }
}