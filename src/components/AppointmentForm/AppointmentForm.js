import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import useFetchData from '../../CustomHooks/useFetchData';
import './AppointmentForm.css';

const AppointmentForm = ({ handleNext, loggedInUser, selectedAppointment }) => {
  const nameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [role, setRole] = useState(null);
  const [customerData, setCustomerData] = useState({ name: '', email: '', phone: '' });
  const { checkRole, fetchCustomerInfo, bookAppointment } = useFetchData();

  useEffect(() => {
    const fetchRole = async () => {
      if (loggedInUser) {
        try {
          const value = await checkRole(loggedInUser.id);
          setRole(value[0].Role);
        } catch (error) {
          console.error('Error fetching role:', error);
        }
      }
    };
    fetchRole();
  }, [loggedInUser, checkRole]);
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        if (role === 2) { //only fill for customers.
          const response = await fetchCustomerInfo(loggedInUser.id);
          const { name, phNumber } = response[0];
          setCustomerData({ name, email: loggedInUser.email || '', phone: phNumber });
        }
        setSelectedDate(format(new Date(selectedAppointment.Date), 'yyyy-MM-dd'));
        setSelectedTime(selectedAppointment.Hours);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };
    if (loggedInUser && selectedAppointment && role !== null) {
      fetchInfo();
    }
  }, [loggedInUser, fetchCustomerInfo, selectedAppointment, role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    //create an object to carry all info and this will be sent to server.
    const appointmentData = {
      UserID: loggedInUser.id,
      EmployeeID: selectedAppointment.EmployeeID,
      name: nameRef.current.value,
      phone: phoneRef.current.value,
      email: emailRef.current.value,
      date: selectedDate,
      time: selectedTime,
    };

    try {
      const response = await bookAppointment(appointmentData);
      if (response) {
        handleNext(response);
      }
      setCustomerData({ name: '', email: '', phone: '' });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form className="appointment-form" onSubmit={handleSubmit}>
      <label>Name:<input type="text" ref={nameRef} defaultValue={customerData.name} required /></label>
      <br />
      <label>Email:<input type="email" ref={emailRef} defaultValue={customerData.email} required /></label>
      <br />
      <label>Phone:<input type="tel" ref={phoneRef} defaultValue={customerData.phone} pattern="[0-9]*" required
       title="Enter only digits for the phone number" />

      </label>
      <br />
      <label>Date:<input type="text" placeholder={selectedDate} disabled={!!selectedAppointment} required /></label>
      <br />
      <label>Time:<input type="text" placeholder={selectedTime} disabled={!!selectedAppointment} required /></label>
      <br />
      <button type="submit">Book Appointment</button>
    </form>
  );
};

export default AppointmentForm;
