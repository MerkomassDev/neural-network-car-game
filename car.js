class Car
{
    constructor(x, y, width, height, controlType, maxSpeed=3)
    {
        //car rendering + sizing
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;

        //
        this.speed=0;
        this.acceleration=0.2;
        this.maxSpeed=maxSpeed;
        this.friction=0.05;
        this.angle=0;
        this.damaged=false;

        this.useBrain=controlType=="AI"

        if(controlType!="DUMMY")
        {
            this.sensor=new Sensor(this);
            this.brain=new NeuralNetwork([this.sensor.rayCount, 6, 4]) 
        }

        this.controls=new Controls(controlType);
    }

    update(roadBorders, traffic)
    {
        if(!this.damaged)
        {
            this.#move();
            this.polygon=this.#createPolygon();
            this.damaged=this.#assessDamage(roadBorders, traffic)
        }
        if(this.sensor)
        {
            this.sensor.update(roadBorders, traffic);
            const offsets=this.sensor.readings.map
            (
                s=>s==null?0:1-s.offset
            )
            const outputs=NeuralNetwork.feedForward(offsets, this.brain)

            if(this.useBrain)
            {
                this.controls.forward=outputs[0]
                this.controls.left=outputs[1]
                this.controls.right=outputs[2]
                this.controls.reverse=outputs[3]
            }
        }
    }
    
    #assessDamage(roadBorders, traffic)
    {
        for(let i=0; i<roadBorders.length; i++)
        {
            if(polysIntersect(this.polygon, roadBorders[i]))
            {
                return true
            }
        }
        for(let i=0; i<traffic.length; i++)
        {
            if(polysIntersect(this.polygon, traffic[i].polygon))
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
            this.speed+=this.acceleration;
        }
        //backwards acceleration/control
        if(this.controls.reverse)
        {
            this.speed-=this.acceleration;
        }

        //caps the max forward speed
        if(this.speed>this.maxSpeed)
        {
            this.speed=this.maxSpeed;
        }
        //caps the max reverse speed
        if(this.speed<-this.maxSpeed*0.6)
        {
            this.speed=-this.maxSpeed*0.6;
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
        if(Math.abs(this.speed)<this.friction)
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

    draw(ctx, color)
    {
        if(this.damaged)
        {
            ctx.fillStyle="gray"
        }
        else
        {
            ctx.fillStyle=color
        }
        ctx.beginPath()
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y)
        for (let i = 1; i < this.polygon.length; i++)
        {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y)
        }
        ctx.fill()

        if(this.sensor)
        {
            this.sensor.draw(ctx);
        }
    }
}
