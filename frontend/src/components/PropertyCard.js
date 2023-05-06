import { Row, Col, Button, Card, Image } from 'react-bootstrap';
import { useDispatch } from 'react-redux';

export default function PropertyCard(property) {

	const dispatch = useDispatch();
	const processClicks = (e, dispatch, functionName, params) => {
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
            <Col xs={2}>
                <Image src={property.image} width="150" />
            </Col>
            <Col xs={10}>
                <Card.Title className="property_title_clickable" onClick={(e) => processClicks(e, dispatch, 'openHotel', { id: property })}>{property.hotel_name} <span style={{position: 'absolute', right: '15px', color: '#000000'}}>${property.hotelbaseprice}</span></Card.Title>
                <Card.Subtitle className="mb-2 text-muted property_location">{property.hotel_addr}, {property.city}</Card.Subtitle>
                <Card.Text>
                  {property.description}
                </Card.Text>
                <Row style={{textAlign: 'right'}}>
                    <Col>
                        {
                            property && property.type === 'admin' ? 
                                <>
                                <Button variant="primary" onClick={(e) => processClicks(e, dispatch, 'editHotel', { id: property.id, data: property })}>Edit</Button>
                                </> : 
                                <Button variant="primary" onClick={(e) => processClicks(e, dispatch, 'openHotel', { id: property })}>Reserve</Button>
                        }
                        {/*
                            <Button variant="danger" className="nav-buttons">Favourite</Button>
                        */}
                    </Col>
                </Row>
            </Col>
            </Row>
          </Card.Body>
        </Card>
	);
}