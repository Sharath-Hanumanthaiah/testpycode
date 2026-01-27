const reportService = require('../services/reportService');
const responseFormatter = require('../utils/responseFormatter');
const logger = require('../utils/logger');

module.exports = {
  async reportPost(req, res) {
    try {
      const { post, reason } = req.body;
      const reportingUser = req.user._id; // Assumes authentication middleware
      if (!post || !reason) {
        return res.status(400).json(responseFormatter.error('Post and reason are required'));
      }
      const report = await reportService.reportPost({ reportingUser, post, reason });
      logger.info(`Report created: ${report._id}`);
      logger.audit('report_post', { user: reportingUser, post, reportId: report._id });
      return res.status(201).json(responseFormatter.success('Report submitted', report));
    } catch (err) {
      logger.error('Error reporting post', err);
      return res.status(500).json(responseFormatter.error('Failed to submit report'));
    }
  },

  async getReports(req, res) {
    try {
      // Authorization check for moderator/admin should be here
      const { status, skip, limit } = req.query;
      const filter = {};
      if (status) filter.status = status;
      const options = {
        skip: parseInt(skip, 10) || 0,
        limit: Math.min(parseInt(limit, 10) || 50, 100),
      };
      const reports = await reportService.getReports(filter, options);
      return res.status(200).json(responseFormatter.success('Reports fetched', reports));
    } catch (err) {
      logger.error('Error fetching reports', err);
      return res.status(500).json(responseFormatter.error('Failed to fetch reports'));
    }
  },

  async updateReportStatus(req, res) {
    try {
      // Authorization check for moderator/admin should be here
      const { id } = req.params;
      const { status } = req.body;
      const reviewedBy = req.user._id; // Assumes authentication middleware
      if (!id || !status) {
        return res.status(400).json(responseFormatter.error('Report ID and status are required'));
      }
      const updated = await reportService.updateReportStatus({ id, status, reviewedBy });
      if (!updated) {
        return res.status(404).json(responseFormatter.error('Report not found'));
      }
      logger.audit('update_report_status', { user: reviewedBy, reportId: id, status });
      return res.status(200).json(responseFormatter.success('Report status updated', updated));
    } catch (err) {
      logger.error('Error updating report status', err);
      return res.status(500).json(responseFormatter.error('Failed to update report status'));
    }
  },
};
