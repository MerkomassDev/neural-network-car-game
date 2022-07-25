class Car
{
    constructor(x, y, width, height)
    {
        //car rendering + sizing
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;

        //physics of the car
        this.speed=0;
        this.forwardAcceleration=0.2;
        this.reverseAcceleration=0.1;
        this.maxForwardSpeed=3;
        this.maxReverseSpeed=1.5;
        this.friction=0.05;
        this.angle=0;

        this.damaged=false;

        this.sensor= new Sensor(this);

        this.controls = new Controls();
    }

    update(roadBorders)
    {
        if(!this.damaged)
        {
        this.#move();
        this.polygon=this.#createPolygon();
        this.damaged=this.#assessDamage(roadBorders)
        }
        this.sensor.update(roadBorders);
    }
    
    #assessDamage(roadBorders)
    {
        for (let i=0; i<roadBorders.length; i++)
        {
            if(polysIntersect(this.polygon, roadBorders[i]))
            {
                return true
            }
        }
        return false
    }

    #createPolygon()
    {
        const points=[];
        const rad=Math.hypot(this.width, this.height)/2; //radius i think
        const alpha=Math.atan2(this.width, this.height);
        points.push(
            {
                x:this.x-Math.sin(this.angle-alpha)*rad,
                y:this.y-Math.cos(this.angle-alpha)*rad
            }
        )

        points.push(
            {
                x:this.x-Math.sin(this.angle+alpha)*rad,
                y:this.y-Math.cos(this.angle+alpha)*rad
            }
        )

        points.push(
            {
                x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
                y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad
            }
        )

        points.push(
            {
                x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
                y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad
            }
        )
        return points
    }

    #move()
    {
        //forward acceleration/control
        if(this.controls.forward)
        {
            this.speed+=this.forwardAcceleration;
        }
        //backwards acceleration/control
        if(this.controls.reverse)
        {
            this.speed-=this.reverseAcceleration;
        }

        //caps the max forward speed
        if(this.speed>this.maxForwardSpeed)
        {
            this.speed=this.maxForwardSpeed;
        }
        //caps the max reverse speed
        if(this.speed<-this.maxReverseSpeed)
        {
            this.speed=-this.maxReverseSpeed;
        }

        //friction
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

        //flips left/right in reverse (it was backwards before)
        if(this.speed!=0)
        {
            const flip=this.speed>0?1:-1;

            //left right controls
            if(this.controls.left)
            {
                this.angle+=0.03*flip;
            }
            if(this.controls.right)
            {
                this.angle-=0.03*flip;
            }
        }
        
        
        this.x-=Math.sin(this.angle)*this.speed;
        this.y-=Math.cos(this.angle)*this.speed;
    }

    draw(ctx)
    {
        if(this.damaged)
        {
            ctx.fillStyle="gray"
        }
        else
        {
            ctx.fillStyle="black"
        }
        ctx.beginPath()
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y)
        for (let i = 1; i < this.polygon.length; i++)
        {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y)
        }
        ctx.fill()

        this.sensor.draw(ctx);
    }
}
