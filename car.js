class Car
{
    constructor(x, y, width, height)
    {
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;

        this.speed=0;
        this.acceleration=0.2;
        this.reverseAcceleration=0.1;
        this.maxSpeed=3;
        this.maxReverseSpeed=1.5;
        this.friction=0.05;

        this.controls = new Controls();
    }

    update()
    {
        if(this.controls.forward)
        {
            this.speed+=this.acceleration;

        }
        if(this.controls.reverse)
        {
            this.speed-=this.reverseAcceleration;
        }

        if(this.speed>this.maxSpeed)
        {
            this.speed=this.maxSpeed;
        }
        if(this.speed<-this.maxReverseSpeed)
        {
            this.speed=-this.maxReverseSpeed;
        }

        if(this.speed>0)
        {
            this.speed-=this.friction;
        }
        if(this.speed<0)
        {
            this.speed+=this.friction;
        }

        //makes sure the car doesn't move when the speed is less than friction (i dont entirely understand how this works)
        if (Math.abs(this.speed)<this.friction)
        {
            this.speed=0;
        }

        this.y-=this.speed;
    }

    draw(ctx)
    {
        ctx.beginPath();
        ctx.rect(
            this.x - this.width / 2,
            this.y - this.height / 2,
            this.width,
            this.height
            );
        ctx.fill();
    }
}
