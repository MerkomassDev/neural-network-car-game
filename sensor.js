class Sensor
{
    constructor(car)
    {
        this.car=car;
        this.rayCount=5;
        this.rayLenght=150;
        this.raySpread=Math.PI/2;
        
        this.rays=[];

        this.readings=[];
    }

    update(roadBorders)
    {
        this.#castRays();
        this.readings=[];
        for(let i=0; i<this.rays.length; i++)
        {
            this.readings.push
            (
                this.#getReadings(this.rays[i], roadBorders)
            )
        }
    }

    #getReadings(ray, roadBorders)
    {
        let touches=[];
        
        for(let i=0; i<roadBorders.length; i++)
        {
            const touch=getIntersection
            (
                ray[0],
                ray[1],
                roadBorders[i][0],
                roadBorders[i][1]
            )
            if(touch)
            {
                touches.push(touch)
            }
        }

        if(touches.length==0)
        {
            return null;
        }
        else
        {
            const offsets=touches.map(e=>e.offset)
            const minOffset=Math.min(...offsets)
            return touches.find(e=>e.offset==minOffset)
        }
    }

    #castRays()
    {
        this.rays=[];
        for(let i=0; i<this.rayCount; i++)
        {
            const rayAngle=lerp
            (
                this.raySpread/2,
                -this.raySpread/2,
                this.rayCount==1?0.5:i/(this.rayCount-1)
            )+this.car.angle;

            const start=
            {
                x:this.car.x, y:this.car.y
            }
            const end=
            {
                x:this.car.x-Math.sin(rayAngle)*this.rayLenght,
                y:this.car.y-Math.cos(rayAngle)*this.rayLenght
            }

            this.rays.push([start,end])
        }
    }

    draw(ctx)
    {
        for(let i=0; i<this.rayCount; i++)
        {
            let end=this.rays[i][1];
            if(this.readings[i])
            {
                end=this.readings[i]
            }

            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="yellow";
            ctx.moveTo
            (
                this.rays[i][0].x,
                this.rays[i][0].y
            )
            ctx.lineTo
            (
                end.x,
                end.y
            )
            ctx.stroke();


            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="black";
            ctx.moveTo
            (
                this.rays[i][1].x,
                this.rays[i][1].y
            )
            ctx.lineTo
            (
                end.x,
                end.y
            )
            ctx.stroke();
        }
    }
}
