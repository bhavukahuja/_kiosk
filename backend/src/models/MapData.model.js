import mongoose from 'mongoose';

const nodeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  { _id: false }
);

const segmentSchema = new mongoose.Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
  },
  { _id: false }
);

const pathSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    // label stored as multilingual object { en, hi, pa }
    label: {
      en: { type: String, required: true },
      hi: { type: String, default: '' },
      pa: { type: String, default: '' },
    },
    segments: [segmentSchema],
  },
  { _id: false }
);

const mapDataSchema = new mongoose.Schema(
  {
    // One document per kiosk/campus; use kioskId to scope if needed
    kioskId: { type: String, default: 'default' },
    nodes: [nodeSchema],
    paths: [pathSchema],
  },
  { timestamps: true }
);

const MapData = mongoose.model('MapData', mapDataSchema);
export default MapData;
