import axiosInstance from '../../../api/axiosInstance';

/**
 * Helper to post request with endpoint fallbacks (/rent-expense/sites vs /accounts/rent-expense/sites)
 */
const postWithFallback = async (endpoints, payload, config) => {
  let lastError = null;
  for (const endpoint of endpoints) {
    try {
      const response = await axiosInstance.post(endpoint, payload, config);
      if (response && (response.status === 200 || response.status === 201)) {
        return response;
      }
    } catch (err) {
      lastError = err;
      if (err.response && err.response.status === 404) {
        continue;
      }
      throw err;
    }
  }
  throw lastError;
};

/**
 * Helper to get request with endpoint fallbacks (/rent-expense/sites vs /accounts/rent-expense/sites)
 */
const getWithFallback = async (endpoints, config) => {
  let lastError = null;
  for (const endpoint of endpoints) {
    try {
      const response = await axiosInstance.get(endpoint, config);
      if (response && response.status === 200) {
        return response;
      }
    } catch (err) {
      lastError = err;
      if (err.response && err.response.status === 404) {
        continue;
      }
      throw err;
    }
  }
  throw lastError;
};

/**
 * createRentalSite
 * Creates a new rental site with owner details and rent configuration.
 * @param {Object} payload Site creation data
 * @returns {Promise<Object>} Created site & vendor ledger response
 */
export const createRentalSite = async (payload) => {
  try {
    const endpoints = [
      '/accounts/rent-expense/sites',
      '/rent-expense/sites',
      '/rent/sites',
    ];

    const response = await postWithFallback(endpoints, payload);
    const body = response.data;

    if (!body || (body.success === false)) {
      const errObj = new Error(body?.message || 'Failed to create rental site.');
      errObj.responseData = body;
      throw errObj;
    }

    return body.data || body.results || body;
  } catch (error) {
    console.error('❌ Error in createRentalSite:', error);
    if (error.response?.data) {
      error.responseData = error.response.data;
    }
    throw error;
  }
};

/**
 * fetchRentalSites
 * Retrieves paginated list of rental sites with filters and summary stats.
 * @param {Object} params Filter & pagination query parameters
 * @returns {Promise<Object>} { sites, pagination, summary }
 */
export const fetchRentalSites = async (params = {}) => {
  try {
    const queryParams = {};
    if (params.page) queryParams.page = params.page;
    if (params.limit) queryParams.limit = params.limit;
    if (params.status && params.status !== 'All') queryParams.status = params.status;
    if (params.city && params.city.trim()) queryParams.city = params.city.trim();
    if (params.state && params.state.trim()) queryParams.state = params.state.trim();
    if (params.search && params.search.trim()) queryParams.search = params.search.trim();

    const endpoints = [
      '/accounts/rent-expense/sites',
      '/rent-expense/sites',
      '/rent/sites',
    ];

    const response = await getWithFallback(endpoints, { params: queryParams });
    const body = response.data;

    if (!body || (body.success === false)) {
      throw new Error(body?.message || 'Failed to fetch rental sites.');
    }

    const data = body.data || body.results || {};
    const sites = data.sites || (Array.isArray(data) ? data : []);
    const pagination = data.pagination || { currentPage: 1, totalPages: 1, totalRecords: sites.length, limit: 10 };
    const summary = data.summary || {
      totalSites: sites.length,
      activeSites: sites.filter(s => s.status === 'active').length,
      inactiveSites: sites.filter(s => s.status === 'inactive').length,
      sitesWithAgreements: sites.filter(s => s.hasActiveAgreement).length,
      totalMonthlyRent: sites.reduce((sum, s) => sum + (s.monthlyRent || 0), 0)
    };

    return {
      sites,
      pagination,
      summary
    };
  } catch (error) {
    console.error('❌ Error in fetchRentalSites:', error);
    throw error;
  }
};

/**
 * createRentAgreement
 * Uploads/saves a new rent agreement for a site with owner and calculation details.
 * @param {Object|FormData} payload Agreement creation payload
 * @returns {Promise<Object>} Created agreement response
 */
export const createRentAgreement = async (payload) => {
  try {
    const endpoints = [
      '/accounts/rent-expense/agreements',
      '/rent-expense/agreements',
      '/rent/agreements',
    ];

    const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData;
    const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};

    const response = await postWithFallback(endpoints, payload, config);
    const body = response.data;

    if (!body || body.success === false) {
      const errObj = new Error(body?.message || 'Failed to upload rent agreement.');
      errObj.responseData = body;
      throw errObj;
    }

    return body.data || body.results || body;
  } catch (error) {
    console.error('❌ Error in createRentAgreement:', error);
    if (error.response?.data) {
      error.responseData = error.response.data;
    }
    throw error;
  }
};

/**
 * fetchRentAgreementById
 * Fetches detailed rent agreement (including fileUrl, fileName, calculations) by agreement ID.
 * @param {string} agreementId Agreement ID (e.g. AGR-1783624734068)
 * @returns {Promise<Object>} Full agreement details
 */
export const fetchRentAgreementById = async (agreementId) => {
  try {
    const endpoints = [
      `/accounts/rent-expense/agreements/${agreementId}`,
      `/rent-expense/agreements/${agreementId}`,
      `/rent/agreements/${agreementId}`,
    ];

    const response = await getWithFallback(endpoints);
    const body = response.data;

    if (!body || body.success === false) {
      throw new Error(body?.message || 'Failed to fetch agreement details.');
    }

    return body.data || body.results || body;
  } catch (error) {
    console.error('❌ Error in fetchRentAgreementById:', error);
    throw error;
  }
};

/**
 * generateMonthlyVoucher
 * Triggers monthly rent expense voucher generation for a site and agreement.
 * @param {Object} payload { siteId, agreementId, month, amount }
 * @returns {Promise<Object>} Generated voucher response data
 */
export const generateMonthlyVoucher = async (payload) => {
  try {
    const endpoints = [
      '/accounts/rent-expense/vouchers/generate',
      '/rent-expense/vouchers/generate',
      '/rent/vouchers/generate',
    ];

    const response = await postWithFallback(endpoints, payload);
    const body = response.data;

    if (!body || body.success === false) {
      const errObj = new Error(body?.message || 'Failed to generate monthly voucher.');
      errObj.responseData = body;
      throw errObj;
    }

    return body.data || body.results || body;
  } catch (error) {
    console.error('❌ Error in generateMonthlyVoucher:', error);
    if (error.response?.data) {
      error.responseData = error.response.data;
    }
    throw error;
  }
};

/**
 * fetchSiteVouchers
 * Retrieves vouchers list, summary stats, and pagination for a specific site.
 * @param {string} siteId Site ID (e.g. SITE-1786509987091)
 * @param {Object} params Optional pagination query params
 * @returns {Promise<Object>} { siteId, siteName, vouchers, summary, pagination }
 */
export const fetchSiteVouchers = async (siteId, params = {}) => {
  try {
    const endpoints = [
      `/accounts/rent-expense/sites/${siteId}/vouchers`,
      `/rent-expense/sites/${siteId}/vouchers`,
      `/rent/sites/${siteId}/vouchers`,
    ];

    const response = await getWithFallback(endpoints, { params });
    const body = response.data;

    if (!body || body.success === false) {
      throw new Error(body?.message || 'Failed to fetch site vouchers.');
    }

    return body.data || body.results || body;
  } catch (error) {
    console.error('❌ Error in fetchSiteVouchers:', error);
    throw error;
  }
};




