const Report = require('../../domain/models/Report');

class ReportRepository {
  async createReport(data) {
    return await Report.create(data);
  }

  async getReports(filter = {}, options = {}) {
    return await Report.find(filter)
      .populate('reportingUser', 'email name')
      .populate('post')
      .sort({ createdAt: -1 })
      .skip(options.skip || 0)
      .limit(options.limit || 50)
      .exec();
  }

  async getReportById(id) {
    return await Report.findById(id)
      .populate('reportingUser', 'email name')
      .populate('post')
      .exec();
  }

  async updateReportStatus(id, status, reviewedBy) {
    return await Report.findByIdAndUpdate(
      id,
      {
        status,
        reviewedBy,
        reviewedAt: new Date(),
      },
      { new: true }
    );
  }
}

module.exports = new ReportRepository();
