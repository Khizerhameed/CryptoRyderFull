<Carousel className="flex-grow py-40">
<Carousel.Item interval={1000}>
  <img
    className="d-block w-100"
    style={{ height: 550 }}
    src={image1}
    alt="First slide"
  />
  <Carousel.Caption>
    <h3>First slide label</h3>
    <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
  </Carousel.Caption>
</Carousel.Item>
<Carousel.Item interval={500}>
  <img
    className="d-block w-100"
    style={{ height: 550 }}
    src={image2}
    alt="Second slide"
  />
  <Carousel.Caption style={{ paddingBottom: 150 }}>
    <div className="row">
      <div className="col-md-3"></div>
      <div className="col-md-6 transparent">
        <div style={{ paddingTop: 50, paddingBottom: 50 }}>
          <h1>Second slide label</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
      </div>
      <div className="col-md-3"></div>
    </div>
  </Carousel.Caption>
</Carousel.Item>
<Carousel.Item>
  <img
    className="d-block w-100"
    style={{ height: 550 }}
    src={image1}
    alt="Third slide"
  />
  <Carousel.Caption>
    <h3>Third slide label</h3>
    <p>
      Praesent commodo cursus magna, vel scelerisque nisl consectetur.
    </p>
  </Carousel.Caption>
</Carousel.Item>
</Carousel>