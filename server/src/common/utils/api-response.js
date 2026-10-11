class Apiresponse {
  static ok(res, message, data = null) {
    return res.status(200).json({
      succes: true,
      message: message,
      data: data,
    });
  }

  static created(res, message, data = null) {
    return res.status(201).json({
      succes: true,
      message: message,
      data: data,
    });
  }

  static noContent(res) {
    return res.status(204).send();
  }
}

export default Apiresponse;
