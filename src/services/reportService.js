const reportRepository = require('../infrastructure/repositories/reportRepository');
const { ReportStatus } = require('../domain/models/Report');
const logger = require('../utils/logger');

class ReportService {
  async reportPost({ reportingUser, post, reason }) {
    logger.info(`User ${reportingUser} is reporting post ${post}`);
    return await reportRepository.createReport({ reportingUser, post, reason });
  }

  async getReports(filter = {}, options = {}) {
    return await reportRepository.getReports(filter, options);
  }

  async getReportById(id) {
    return await reportRepository.getReportById(id);
  }

  async updateReportStatus({ id, status, reviewedBy }) {
    logger.info(`Report ${id} status updated to ${status} by ${reviewedBy}`);
    if (!Object.values(ReportStatus).includes(status)) {
      throw new Error('Invalid status');
    }
    return await reportRepository.updateReportStatus(id, status, reviewedBy);
  }
}

module.exports = new ReportService();
