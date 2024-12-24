import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'

const FormContainer = ({ children, title }) => {
	return (
		<Container>
			<Row className="justify-content-md-center">
				<Col xs={12} md={8} lg={6}>
					<Card className="shadow-sm p-4 rounded">
						{title && (
							<Card.Header className="text-center bg-primary text-white rounded">
								<h4>{title}</h4>
							</Card.Header>
						)}
						<Card.Body>{children}</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	)
}

export default FormContainer
