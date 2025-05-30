import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required'],
    index: true
  },
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    minlength: [3, 'Project name must be at least 3 characters long'],
    maxlength: [100, 'Project name cannot exceed 100 characters']
  },
  details: {
    type: String,
    required: [true, 'Project details are required'],
    trim: true,
    minlength: [10, 'Project details must be at least 10 characters long'],
    maxlength: [5000, 'Project details cannot exceed 5000 characters']
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Due date must be in the future'
    }
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['Development', 'Design', 'Marketing', 'Research', 'Other'],
      message: '{VALUE} is not a supported category'
    }
  },
  status: {
    type: String,
    enum: {
      values: ['open', 'in-progress', 'review', 'completed', 'cancelled'],
      message: '{VALUE} is not a valid status'
    },
    default: 'open',
    index: true
  },
  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high', 'urgent'],
      message: '{VALUE} is not a valid priority level'
    },
    default: 'medium'
  },
  assignedUsers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    role: {
      type: String,
      enum: ['leader', 'member'],
      default: 'member'
    },
    assignedAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  attachments: [{
    name: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Indexes for better query performance
projectSchema.index({ name: 'text', details: 'text' })
projectSchema.index({ creator: 1, status: 1 })
projectSchema.index({ dueDate: 1 })

// Virtual for calculating days until due date
projectSchema.virtual('daysUntilDue').get(function() {
  return Math.ceil((this.dueDate - new Date()) / (1000 * 60 * 60 * 24));
})

// Pre-save middleware to ensure assignedUsers array is unique
projectSchema.pre('save', function(next) {
  this.assignedUsers = [...new Set(this.assignedUsers)];
  next();
})

export default mongoose.model('Project', projectSchema)