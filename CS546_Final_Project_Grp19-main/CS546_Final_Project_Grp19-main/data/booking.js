const mongoCollections = require("../config/mongoCollections");
const bookings = mongoCollections.booking;
const cars = require("./cars");
const car = mongoCollections.cars;
const { ObjectId } = require("mongodb");
const validation = require("../validation");
//const bookh = require('bookings.')
//const currentD = $.current-date;
//daysTag = require(".days");


const createBooking = async (userId, carSelectedId,amountPaid, pickUpDate, pickUpTime, returnTime, returnDate, location) => {
  //console.log("inside create booking - 1")
  if(!userId){
    throw `Error: Please enter the userID`;
  }
  if(!carSelectedId){
    throw `Error: Please enter the carSelectedId`;
  }
    if (!amountPaid) {
        throw "Please enter amount";
    }
    if (!pickUpDate){
        throw "please enter CVV";
    }
    if (!pickUpTime){
        throw "Enter cardholder on the card";
    }
    if (!returnTime){
        throw "Enter return time";
    }
    if (!returnDate){
      throw "Enter return date";
  }

  if (!location){
    throw "Enter location";
}


  
     validation.checkString(amountPaid, 'The amountPaid');
     validation.checkString(pickUpDate, 'The pickUpDate');
     validation.checkString(pickUpTime, 'The pickUpTime');
     validation.checkString(returnTime, 'returnTime');
     validation.checkString(returnDate, 'returnDate');
     validation.checkString(location, 'location');
     validation.checkId(userId, 'userId');
     validation.checkString(carSelectedId, 'carSelectedId');


  //validating pickupDate:
  //let date = new Date();
  //currentY = date.getFullYear();
  //currentM = date.getMonth();
  //pickUpDate = cDay + "/" + cMonth + "/" + cYear
  //currentD = date.getDate();

  //const months = ["Jan", "Feb", "Mar", "April", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
  //const calenderDateSelected = async () => {
  //  let lastDayOfMonth = new Date(currentY, currentM + 1, 0).getDate();
  //let liTag = "";
  //for(let i =1; i <= lastDayOfMonth; i++){
  //  liTag += '${i}';
  //}
  //currentD.innerText = '${months[currentM]} ${currentY}';
  //daysTag.innerHtml = liTag;

  //}
  //calenderDateSelected();

  const bookingCollection = await bookings();
  //  const booking = await bookingCollection.findOne({ amountPaid: amountPaid });

  //console.log("inside create booking - 2")
  // if (booking) {
  //       throw `Error: Email is already present or in use.`;
  // }
//console.log('updatedCar') 
  let carSelectedDetails = await cars.getCarById(carSelectedId);
  let carCollection = await car();

 
  carSelectedDetails.availability = "no";
  //console.log("carSelectedDetails..",carSelectedDetails);

  let newBooking = {
    userId: userId,
    amountPaid: amountPaid,
    pickUpDate: pickUpDate,
    pickUpTime: pickUpTime,
    returnTime: returnTime,
    returnDate: returnDate,
    location: location,
    carDetails: [carSelectedDetails], // get the card details
  };
  const updatedCar = await carCollection.updateOne(
    { _id: ObjectId(carSelectedDetails._id) },
    {
      $set: { availability: 'no' },
    }
  );

  const insertInfo = await bookingCollection.insertOne(newBooking);
  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw "Could not add booking details";
  }
  // console.log('insertedCar..',insertInfo)
  return { insertedCar: true };
};

const getBookingById = async (bookingId) => {
  
    bookingId = bookingId.trim();
   validation.checkId(bookingId);
    const bookingCollection = await bookings();
  
    const particularBooking = await bookingCollection.findOne({_id: ObjectId(bookingId)});
    if (particularBooking === null) throw 'Error: No bookings with that id';
    //particularMovie._id = particularMovie._id.toString();
    return particularBooking;
  
  };
  const getBookingByUserId = async (userId) => {
    
    userId = userId.trim();
 
   validation.checkString(userId);
  
    const bookingCollection = await bookings();
    
    const particularBooking = await bookingCollection.find({userId: {$eq:userId}}).toArray();
    if (particularBooking === null) throw 'Error: No bookings with that id';
    //particularMovie._id = particularMovie._id.toString();
    
    return particularBooking;
  
  };
  const deleteBookingDetails = async (bookingId) => {
  
    bookingId = bookingId.trim();
    validation.checkId(bookingId);
  const bookingCollection = await bookings();
  const particularBooking = await bookingCollection.findOne({
    _id: ObjectId(bookingId)
  });
  if (particularBooking === null) throw "Error: No bookings with that id";
  //particularMovie._id = particularMovie._id.toString();
  const deletionInfo = await bookingCollection.deleteOne({_id: ObjectId(bookingId)});
  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete movie with id of ${id}`;
  }
  //return `${particularMovie.title} has been successfully deleted!`;  
};


const updateBooking = async (
  bookingId,
  amountPaid,
  pickUpDate,
  pickUpTime,
  returnTime,
  returnDate
) => {
  if (!amountPaid) {
    throw "Please enter credit card number";
  }
  if (!pickUpDate) {
    throw "please enter CVV";
  }
  if (!pickUpTime) {
    throw "Enter cardholder on the card";
  }
  if (!returnTime) {
    throw "Enter expiry month for the credit card";
  }
  if (!returnDate) {
    throw "Enter expiry year for the credit card";
  }

  validation.checkString(amountPaid, "The amountPaid");
  validation.checkString(pickUpDate, "The pickUpDate");
  validation.checkString(pickUpTime, "The pickUpTime");
  validation.checkString(returnTime, "returnTime");
  validation.checkString(returnDate, "returnDate");

  //validating amountpaid

  let updateBooking = {
    amountPaid: amountPaid,
    pickUpDate: pickUpDate,
    pickUpTime: pickUpTime,
    returnTime: returnTime,
    returnDate: returnDate,
  };
  const bookingCollection = await bookings();
  const updatedInfo = await bookingCollection.updateOne(
    { _id: ObjectId(bookingId) },
    { $set: updateBooking }
  );
  if (updatedInfo.modifiedCount === 0) {
    throw "could not update bookings successfully";
  }
  //return {Update: "done"};
};
const getAllBookings = async () => {
  const bookingCollection = await bookings();
  const bookingList = await bookingCollection.find({}).toArray();
  if (!bookingList) throw "Could not get all bookings";
  // moviesList._id = moviesList._id.toString();
  for (let i in bookingList) {
    bookingList[i]._id = bookingList[i]._id.toString();
  }
  return bookingList;
};

  module.exports = {
    createBooking,
    getBookingById,
    deleteBookingDetails,
    updateBooking,
    getAllBookings,
    getBookingByUserId
  };
