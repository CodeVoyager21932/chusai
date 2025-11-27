// utils/error-handler.js
// 错误处理工具

/**
 * 处理错误
 * @param {Error} error 错误对象
 * @param {string} context 错误上下文
 */
function handleError(error, context = '') {
  console.error(`[${context}] Error:`, error);
  
  // 用户友好的错误提示
  const userMessage = getUserFriendlyMessage(error);
  wx.showToast({
    title: userMessage,
    icon: 'none',
    duration: 2000
  });
  
  // 上报错误日志（可选）
  reportError(error, context);
}

/**
 * 获取用户友好的错误信息
 * @param {Error} error 错误对象
 * @returns {string} 用户友好的错误信息
 */
function getUserFriendlyMessage(error) {
  if (!error) return '操作失败，请重试';
  
  const errorCode = error.code || error.errCode;
  const errorMsg = String(error.message || error.errMsg || '');
  
  // 网络错误
  if (errorCode === 'NETWORK_ERROR' || (errorMsg && errorMsg.includes('network'))) {
    return '网络连接失败，请检查网络';
  }
  
  // API限流
  if (errorCode === 'API_LIMIT' || (errorMsg && errorMsg.includes('limit'))) {
    return 'AI服务繁忙，请稍后再试';
  }
  
  // 云函数错误
  if (errorCode === 'CLOUD_FUNCTION_ERROR') {
    return '服务暂时不可用，请稍后再试';
  }
  
  // 权限错误
  if (errorMsg && (errorMsg.includes('permission') || errorMsg.includes('auth'))) {
    return '权限不足，请重新授权';
  }
  
  // 默认错误
  return '操作失败，请重试';
}

/**
 * 上报错误日志
 * @param {Error} error 错误对象
 * @param {string} context 错误上下文
 */
function reportError(error, context) {
  // 本地记录错误日志
  try {
    const errorLogs = wx.getStorageSync('errorLogs') || [];
    errorLogs.push({
      message: error.message || error.errMsg || '未知错误',
      context,
      timestamp: new Date().toISOString(),
      stack: error.stack || ''
    });
    
    // 只保留最近50条错误日志
    if (errorLogs.length > 50) {
      errorLogs.shift();
    }
    
    wx.setStorageSync('errorLogs', errorLogs);
  } catch (err) {
    console.error('记录错误日志失败', err);
  }
}

/**
 * 网络请求错误处理
 * @param {object} error 错误对象
 * @returns {string} 错误信息
 */
function handleNetworkError(error) {
  if (!error) return '网络请求失败';
  
  const statusCode = error.statusCode;
  
  if (statusCode === 404) {
    return '请求的资源不存在';
  } else if (statusCode === 500) {
    return '服务器错误，请稍后再试';
  } else if (statusCode === 401 || statusCode === 403) {
    return '权限不足，请重新登录';
  } else if (statusCode >= 400 && statusCode < 500) {
    return '请求参数错误';
  } else if (statusCode >= 500) {
    return '服务器错误';
  }
  
  return '网络连接失败';
}

/**
 * 云函数调用错误处理
 * @param {object} error 错误对象
 * @param {string} functionName 云函数名称
 */
function handleCloudError(error, functionName) {
  console.error(`云函数 ${functionName} 调用失败:`, error);
  
  let message = '服务暂时不可用';
  
  if (error.errCode === -1) {
    message = '网络连接失败';
  } else if (error.errMsg && String(error.errMsg).includes('timeout')) {
    message = '请求超时，请重试';
  }
  
  wx.showToast({
    title: message,
    icon: 'none',
    duration: 2000
  });
  
  reportError(error, `云函数-${functionName}`);
}

/**
 * 获取错误日志
 * @returns {Array} 错误日志数组
 */
function getErrorLogs() {
  try {
    return wx.getStorageSync('errorLogs') || [];
  } catch (error) {
    return [];
  }
}

/**
 * 清除错误日志
 */
function clearErrorLogs() {
  try {
    wx.removeStorageSync('errorLogs');
  } catch (error) {
    console.error('清除错误日志失败', error);
  }
}

module.exports = {
  handleError,
  getUserFriendlyMessage,
  reportError,
  handleNetworkError,
  handleCloudError,
  getErrorLogs,
  clearErrorLogs
};
