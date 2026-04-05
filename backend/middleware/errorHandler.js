/**
 * 统一错误处理中间件
 */
function errorHandler(err, req, res, next) {
  console.error('服务器错误:', err);
  
  // 返回统一的错误格式
  res.status(err.status || 500).json({
    success: false,
    message: err.message || '服务器内部错误'
  });
}

module.exports = { errorHandler };
