import { Row, Col, Button, Card, Image } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { getShortDate } from '../utils';

export default function BookingCard(property) {

	const dispatch = useDispatch();
	const processClicks = (e, functionName, params) => {
        e.stopPropagation();
        const {fn} = property;
        if (fn && fn[functionName] && dispatch) {
            fn[functionName](dispatch, params.id, params.data);
        }
    };

	return (
		<Card className="property_card">
          <Card.Body>
            <Row>
            <Col xs={1}>
                <Image src={property.hotel.image} width="100" />
            </Col>
            <Col xs={11} style={{paddingLeft: '25px'}}>
                <Card.Title className="property_title">{property.hotel.hotel_name} <span style={{position: 'absolute', right: '20px', color: '#000000'}}>${Math.trunc(property.amount)}</span></Card.Title>
                <Card.Subtitle className="mb-2 text-muted property_location">{property.hotel.hotel_addr}, {property.hotel.city}</Card.Subtitle>
                <Card.Text style={{fontSize: '12px', marginBottom: '0px', marginTop: '-5px'}}>
                  <span className="book-roomtype">{property.roomtypename}</span> room from {getShortDate(property.start_date)} to {getShortDate(property.end_date)} for {property.numberofguests} guests
                </Card.Text>
                <Card.Text style={{fontSize: '12px', marginBottom: '0px', color: '#808080'}}>
                  Booked on {getShortDate(property.booking_date)}
                </Card.Text>
                <Row style={{textAlign: 'right'}}>
                    <Col style={{padding: '0', marginTop: '-28px'}}>
                        <Button variant="warning" className="nav-buttons-bkng" onClick={(e) => processClicks(e, 'editBooking', {id: property.reservation_id})}>Modify</Button>
                        <Button variant="danger" className="nav-buttons-bkng"  onClick={(e) => processClicks(e, 'removeBooking', {id: property.reservation_id})}>Cancel</Button>
                    </Col>
                </Row>
            </Col>
            </Row>
          </Card.Body>
        </Card>
	);
}