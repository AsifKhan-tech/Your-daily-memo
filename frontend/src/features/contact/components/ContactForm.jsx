import { useRef, useState } from "react";

import { validateContactDto } from "../dto/contact.dto.js";
import { submitContact } from "../services/contactService.js";

function ContactForm() {
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submissionStarted = useRef(false);

  function handleFieldChange(field, value) {
    if (field === "email") {
      setEmail(value);
    } else {
      setDescription(value);
    }

    setErrors((previous) => ({
      ...previous,
      [field]: "",
    }));
    setFeedback(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (submissionStarted.current) return;

    const validation = validateContactDto({ email, description });
    if (!validation.isValid) {
      setErrors(validation.errors);
      setFeedback(null);
      return;
    }

    submissionStarted.current = true;
    setIsSubmitting(true);
    setErrors({});
    setFeedback(null);

    try {
      const response = await submitContact(validation.data);

      setFeedback({
        type: "success",
        message: response.message || "Your message has been sent.",
      });
      setEmail("");
      setDescription("");
      setErrors({});
    } catch (error) {
      setFeedback({
        type: "error",
        message: error.message || "Unable to send your message. Please try again.",
      });
    } finally {
      submissionStarted.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <section
      className="contact-section"
      id="contact"
      aria-labelledby="contact-title"
    >
      <p className="eyebrow">Contact us</p>

      <h2 id="contact-title">How can we help?</h2>

      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="contact-email">Email</label>

        <input
          type="email"
          className="todo"
          id="contact-email"
          name="email"
          placeholder="jane.doe@example.com"
          autoComplete="email"
          maxLength={254}
          value={email}
          onChange={(event) => handleFieldChange("email", event.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={
            errors.email ? "contact-email-error" : undefined
          }
          required
        />

        {errors.email && (
          <small className="field-error" id="contact-email-error">
            {errors.email}
          </small>
        )}

        <label htmlFor="contact-description">Description</label>

        <textarea
          className="todo contact-description"
          id="contact-description"
          name="description"
          placeholder="Tell us how we can help"
          rows={6}
          minLength={2}
          maxLength={500}
          value={description}
          onChange={(event) =>
            handleFieldChange("description", event.target.value)
          }
          aria-invalid={Boolean(errors.description)}
          aria-describedby={
            errors.description ? "contact-description-error" : undefined
          }
          required
        />

        {errors.description && (
          <small className="field-error" id="contact-description-error">
            {errors.description}
          </small>
        )}

        <button className="add-todo" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending message..." : "Send message"}
        </button>

        {feedback && (
          <p
            className="contact-status"
            role={feedback.type === "error" ? "alert" : "status"}
            aria-live={feedback.type === "error" ? "assertive" : "polite"}
          >
            {feedback.message}
          </p>
        )}
      </form>
    </section>
  );
}

export default ContactForm;
