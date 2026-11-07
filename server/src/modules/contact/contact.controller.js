import * as contactService from "./contact.service.js";
import Apiresponse from "../../common/utils/api-response.js";

const createContact = async (req, res) => {
  const contact = await contactService.createContact(req.body);

  Apiresponse.created(res, "Your query submitted successfully", {});
};

export { createContact };
