/////////////////////////////Internal functions\\\\\\\\\\\\\\\\\\\\\\\\\\

function sendResponse(statuscode, message, res) {
  return res.status(statuscode).json({ message: message });
}

module.exports = sendResponse
