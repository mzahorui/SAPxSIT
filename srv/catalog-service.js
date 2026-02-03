function extractOrderNumber(where) {
  if (!Array.isArray(where)) return null;
  for (let i = 0; i < where.length - 2; i += 1) {
    const left = where[i];
    const op = where[i + 1];
    const right = where[i + 2];
    if (left && left.ref && left.ref[left.ref.length - 1] === 'orderNumber' && op === '=' && right && Object.prototype.hasOwnProperty.call(right, 'val')) {
      return right.val;
    }
  }
  return null;
}

module.exports = (srv) => {
  const { Orders } = srv.entities;

  srv.after('READ', Orders, (result, req) => {
    if (!req || !req.query || !req.query.SELECT) return;

    const orderNumber = extractOrderNumber(req.query.SELECT.where);
    if (!orderNumber) return;

    const isEmpty = Array.isArray(result) ? result.length === 0 : !result;
    if (isEmpty) {
      req.info({
        message: `No order found for ID ${orderNumber}. You can find valid Order IDs in the Orders list or the Orders CSV file.`,
        code: 'ORDER_NOT_FOUND',
        target: 'orderNumber'
      });
    }
  });
};
