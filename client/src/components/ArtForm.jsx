import { useState } from "react";
import CatalogueItem from "./CatalogueItem";

const ArtForm = () => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const apiBaseURL = import.meta.env.VITE_API_BASE_URL;

  const sections = [
    "Ceramics",
    "Electronic Arts",
    "Jewellery",
    "Painting",
    "Photography",
    "Print",
    "Sculpture",
    "Textiles",
  ];

  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    title: "",
    section: sections[0],
    medium: "",
    siteMap: 1,
  });
  const [items, setItems] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const addItem = () => {
    const newItem = {
      title: "",
      medium: "",
      dimensions: "",
      hasEdition: false,
      editions: "",
      nfs: false,
      value: "",
    };
    setItems([...items, newItem]);
  };

  const handleItemChange = (id, updatedItem) => {
    setItems((prevItems) =>
      prevItems.map((item, index) => (index === id ? updatedItem : item))
    );
  };

  const deleteItem = (id) => {
    setItems((prevItems) => prevItems.filter((_, index) => index !== id));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    setSubmitted(true);

    if (items.length === 0) {
      setMessage("Please add at least one item to the catalogue.");
      return;
    }

    if (window.confirm("Press OK if your information is correct?")) {
      setMessage("Submitting...");

      const formattedItems = items.map((item) => ({
        ...item,
        editions: item.editions ? parseInt(item.editions, 10) : null,
        value: item.value ? parseFloat(item.value) : null,
      }));

      try {
        const res = await fetch(`${apiBaseURL}/catalogue-items`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            siteMap: parseInt(formData.siteMap, 10),
            section: formData.section,
            items: formattedItems,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setMessage("Submission unsuccessful.");
          setErrors(data.errors || {});
        } else {
          setMessage("Submission successful.");
          setFormData({
            firstName: "",
            lastName: "",
            title: "",
            section: sections[0],
            medium: "",
            siteMap: 1,
          });
          setItems([]);
          setErrors({});
          setSubmitted(false);
        }
      } catch (error) {
        setMessage("Submission unsuccessful.");
      }
    }
  };

  return (
    <article className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
      <header>
        <h1 className="text-2xl font-bold text-gray-700 mb-4">
          Dunedin School of Art - SITE Form
        </h1>
        <p className="text-gray-700 mb-4">
          You can find your entry information here -{" "}
          <a
            href="/entries"
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 underline"
          >
            {baseURL}/entries
          </a>
        </p>
      </header>

      <section aria-labelledby="form-instructions">
        <hr className="border-gray-300 my-4" />
        <p id="form-instructions" className="text-gray-700 mb-4">
          Fill out the following form to add your art to the catalogue.
        </p>
        {message && <p className="text-red-600 mb-4 font-medium">{message}</p>}
      </section>

      <form autoComplete="off" onSubmit={onSubmit}>
        <fieldset className="mb-4">
          <legend className="text-lg font-semibold text-gray-700">
            Artist Information
          </legend>

          <label className="block text-gray-700 mt-4">First Name</label>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
          {submitted && errors.firstName && (
            <p className="text-red-500">First name is required.</p>
          )}

          <label className="block text-gray-700 mt-4">Last Name</label>
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
          {submitted && errors.lastName && (
            <p className="text-red-500">Last name is required.</p>
          )}

          <label className="block text-gray-700 mt-4">SITE Map Number</label>
          <input
            type="number"
            name="siteMap"
            value={formData.siteMap}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
          {submitted && errors.siteMap && (
            <p className="text-red-500">
              Site map must be a number greater than 0.
            </p>
          )}

          <label className="block text-gray-700 mt-4">Section</label>
          <select
            name="section"
            value={formData.section}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          >
            {sections.map((section, index) => (
              <option key={index} value={section}>
                {section}
              </option>
            ))}
          </select>
        </fieldset>

        <fieldset className="mb-4">
          <legend className="text-lg font-semibold text-gray-700">
            Catalogue Items
          </legend>
          <div className="mt-4">
            {items.map((item, index) => (
              <CatalogueItem
                key={index}
                id={index}
                item={item}
                onChange={handleItemChange}
                onDelete={deleteItem}
                submitted={submitted}
                errors={errors}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={addItem}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Add Another Catalogue Item
          </button>
        </fieldset>

        <section>
          <p className="text-gray-700">
            Please note that Otago Polytechnic takes a 25% commission.
          </p>
        </section>

        <button
          type="submit"
          className="w-full py-2 px-4 mt-4 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none"
        >
          Submit
        </button>
      </form>
    </article>
  );
};

export default ArtForm;
