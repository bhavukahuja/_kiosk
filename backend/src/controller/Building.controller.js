import Building from '../models/Building.model.js';
import cloudinary from '../config/Cloudinary.js';

export const addBuilding = async (req, res) => {
  try {
    const {
      name,
      code,
      type,
      description,
      coordinates,
      totalFloors,
      isAccessible,
      hasLift,
      rooms,
      departments,
      openTime,
      closeTime,
      isOpenWeekends,
      contactNumber,
      contactEmail,
      departmentInfo,
      imageUrl = [],
    } = req.body;

    console.log(imageUrl);

    if (!name || !type || !coordinates || !coordinates.lat || !coordinates.lng) {
      return res
        .status(400)
        .json({ message: 'Name, type, and coordinates (lat,lng) are required' });
    }

    const uploadedImageArray = [];
    for (const image of imageUrl) {
      const uploadResult = await cloudinary.uploader.upload(image, {
        folder: 'kiosk/buildings',
        resource_type: 'image',
      });
      uploadedImageArray.push(uploadResult.secure_url);
    }

    console.log(uploadedImageArray);

    const newBuilding = new Building({
      name,
      code,
      type,
      description,
      coordinates,
      totalFloors,
      isAccessible,
      hasLift,
      rooms,
      departments,
      openTime,
      closeTime,
      isOpenWeekends,
      contactNumber,
      contactEmail,
      departmentInfo,
      imageUrl: uploadedImageArray,
    });

    const savedBuilding = await newBuilding.save();
    res.status(201).json(savedBuilding);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
    console.log(err);
  }
};

export const getAllBuildings = async (req, res) => {
  try {
    const buildings = await Building.find();
    res.status(200).json(buildings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getBuildingById = async (req, res) => {
  try {
    const building = await Building.findById(req.params.id);
    if (!building) {
      return res.status(404).json({ message: 'Building not found' });
    }
    res.status(200).json(building);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updateBuilding = async (req, res) => {
  try {
    const updated = await Building.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Building not found' });
    }
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const deleteBuilding = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBuilding = await Building.findByIdAndDelete(id);
    res.status(200).json({ message: 'Building deleted successfully', deletedBuilding });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
    console.log(err);
  }
};
