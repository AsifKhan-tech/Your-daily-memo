import { useState } from "react";

function ContactForm() {
  const [nameOrEmail, setNameOrEmail] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedNameOrEmail = nameOrEmail.trim();
    const trimmedDescription = description.trim();

    if (!trimmedNameOrEmail || !trimmedDescription) {
      setStatus("Please fill in both fields.");
      return;
    }

    // Frontend-only for now. No message is sent to a server.
    setStatus("Thanks! Your message has been recorded in this form.");

    setNameOrEmail("");
    setDescription("");
  }

  return (
    <section
      className="contact-section"
      id="contact"
      aria-labelledby="contact-title"
    >
      <p className="eyebrow">Contact us</p>

      <h2 id="contact-title">How can we help?</h2>

      <form className="contact-form" onSubmit={handleSubmit}>
        <label htmlFor="contact-name">Name or email</label>

        <input
          className="todo"
          id="contact-name"
          name="contact-name"
          type="text"
          placeholder="Your name or email"
          autoComplete="email"
          value={nameOrEmail}
          onChange={(event) => setNameOrEmail(event.target.value)}
          required
        />

        <label htmlFor="contact-description">Description</label>

        <textarea
          className="todo contact-description"
          id="contact-description"
          name="description"
          placeholder="Tell us how we can help"
          rows={6}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
        />

        <button className="add-todo" type="submit">
          Send message
        </button>

        <p className="contact-status" role="status" aria-live="polite">
          {status}
        </p>
      </form>
    </section>
  );
}

export default ContactForm;
