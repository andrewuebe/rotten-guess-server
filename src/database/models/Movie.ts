import mongoose, { Schema, Document, Model } from 'mongoose';

interface MovieDocument extends Document {
  title: string;
  rt_score: string;
  rating: string;
  url: string;
  genre: string[];
  director: string;
  year: string;
  cast_names: string[];
  box_office_rank: number;
}

const MovieSchema: Schema = new Schema({
  title: {
    type: String,
    required: true
  },
  audience_score: {
    type: String,
    required: true
  },
  rt_score: {
    type: String,
    required: true
  },
  rating: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  genre: {
    type: Array,
    required: true
  },
  director: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  cast_names: {
    type: Array,
    required: true
  },
  box_office_rank: {
    type: Number,
    required: true
  }
}, {
  timestamps: {
    updatedAt: 'updated_at'
  }
});

const Movie: Model<MovieDocument> = mongoose.model<MovieDocument>('Movie', MovieSchema);

export { Movie, MovieDocument };
