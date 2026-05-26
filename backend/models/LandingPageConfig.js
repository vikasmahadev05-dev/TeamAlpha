const mongoose = require('mongoose');

const LandingPageConfigSchema = new mongoose.Schema({
  hero: { type: mongoose.Schema.Types.Mixed, default: {} },
  about: { type: mongoose.Schema.Types.Mixed, default: {} },
  services: { type: mongoose.Schema.Types.Mixed, default: {} },
  gallery: { type: mongoose.Schema.Types.Mixed, default: {} },
  testimonials: { type: mongoose.Schema.Types.Mixed, default: {} },
  contact: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

module.exports = mongoose.model('LandingPageConfig', LandingPageConfigSchema);
