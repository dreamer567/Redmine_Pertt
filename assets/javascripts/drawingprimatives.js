/*--------------------------------------------------------------------------------*
 *  ,-----.                 ,--.    ,--.     ,----. ,--.                   ,--.  
 *  |  .-. | ,---. ,--.--.,-'  '-.,-'  '-.  '  .-./ |  |    ,--.-.,--.--.,-'  '-.
 *  |  '-' || .-. :|  .--''-.  .-''-.  .-'  |  |  _ |  '--.| .-. ||  .--''-.  .-'
 *  |  |--' \   --.|  |     |  |    |  |    '  '-' ||  .  |' '-' ||  |     |  |  
 *  `--'     `----'`--'     `--'    `--'     `----' `--'--' `--'-'`--'     `--'  
 *    file: drawingprimatives
 *    desc: This file contains all the drawing primitives that the pertt chart
 *          will use.
 *
 *  author: Peter Antoine
 *    date: 22/12/2012 14:30:28
 *--------------------------------------------------------------------------------*
 *                     Copyright (c) 2012 Peter Antoine
 *                            All rights Reserved.
 *                    Released Under the Artistic Licence
 *--------------------------------------------------------------------------------*/

/* 1 pixel border and 5 pixel margin */
var DP_BOX_CORNER_RADIUS	= 6;							/* the radius of the corner of the boxes */
var DP_BOX_SPACING			= DP_BOX_CORNER_RADIUS;			/* space between the box and the contents */
var DP_BOX_TOTAL_SPACING	= DP_BOX_SPACING * 2;			/* total whitespace on both sides */
var DP_FONT_SIZE_PX			= 10;
var DP_BOX_HEIGHT			= DP_BOX_TOTAL_SPACING + DP_FONT_SIZE_PX;
var DP_DOUBLE_BOX_HEIGHT	= DP_BOX_TOTAL_SPACING + DP_FONT_SIZE_PX + DP_FONT_SIZE_PX;

function DP_getBoxSize(context,item)
{
	item.hotspot.width	= context.measureText(item.name).width + DP_BOX_TOTAL_SPACING;
	item.hotspot.height = DP_BOX_HEIGHT;
}

function DP_getDoubleBoxSize(context,item)
{
	var text

	var text_width_1 = context.measureText(item.name).width;
	var text_width_2 = context.measureText(item.date_string).width;

	if (text_width_1 > text_width_2)
		item.hotspot.width	= text_width_1 + DP_BOX_TOTAL_SPACING;
	else
		item.hotspot.width	= text_width_2 + DP_BOX_TOTAL_SPACING;


	item.hotspot.height = DP_DOUBLE_BOX_HEIGHT;
}


function DP_drawFlatArrow(context,x,y,length,pointers)
{
	context.beginPath();
	context.strokeStyle = '#000'; // black
	context.lineWidth   = 1;
	context.moveTo(x,y);
	context.lineTo(x+length,y);
	context.stroke();

	if (pointers)
	{
		point_dir = 0 - Math.abs(length)/length;
		
		var start = x+length;

		// draw pointer
		context.beginPath();
		context.fillStyle   = '#000'; // black
		context.moveTo(start,y);
		context.lineTo(start + (10 * point_dir),y - 4);
		context.lineTo(start + (10 * point_dir),y + 4);
		context.fill();
	}
}

// Draw box curve
// This will assume that the start and end points form a box
// and the curve will be drawn from the start point to the 
// end point.
function DP_drawBoxCurve(context,start_x,start_y,end_x,end_y)
{
	var inflection_x = start_x + ((end_x - start_x) / 2);

    context.beginPath();
	context.strokeStyle = '#000'; // black
    context.moveTo(start_x,start_y);
    context.bezierCurveTo(inflection_x,start_y,inflection_x,end_y,end_x,end_y);
    context.stroke();
}

// Draw a box with rounded corners.
// x,y is the top left corner.
// This box has two lines of text.
function DP_drawTextDoubleBoxRounded(context,x,y,text_1,text_2,colour,repaint)
{
	context.textBaseline = 'middle';
	var height = DP_FONT_SIZE_PX * 2;
	var text_width_1 = context.measureText(text_1).width;
	var text_width_2 = context.measureText(text_2).width;

	if (text_width_1 > text_width_2)
		var width = text_width_1;
	else
		var width = text_width_2;

	// Ok draw and fill the circle
	context.beginPath();
	context.fillStyle   = colour;
	context.strokeStyle = '#000'; // black
	context.lineWidth   = 1;

	context.arc(x + DP_BOX_CORNER_RADIUS,			y + DP_BOX_CORNER_RADIUS			,DP_BOX_CORNER_RADIUS	, Math.PI		, Math.PI * 1.5	, false);
	context.arc(x + width + DP_BOX_CORNER_RADIUS,	y + DP_BOX_CORNER_RADIUS			,DP_BOX_CORNER_RADIUS	, Math.PI * 1.5	, 0				, false);
	context.arc(x + width + DP_BOX_CORNER_RADIUS,	y + height + DP_BOX_CORNER_RADIUS	,DP_BOX_CORNER_RADIUS	, 0				, Math.PI * 0.5	, false);
	context.arc(x + DP_BOX_CORNER_RADIUS,			y + height + DP_BOX_CORNER_RADIUS	,DP_BOX_CORNER_RADIUS	, Math.PI * 0.5	, Math.PI 		, false);
	context.lineTo(x ,y + DP_BOX_CORNER_RADIUS);

	/* shadows are accumulative (well at least in Firefox) so don't draw on repaint */
	if (!repaint)
	{
		context.shadowColor = "rgba( 0, 0, 0, 0.3 )";
		context.shadowOffsetX = 2;
		context.shadowOffsetY = 2;
		context.shadowBlur = 3;
	}

	context.stroke();
	context.fill();

	// reset the shadow before re-drawing
	context.shadowOffsetX = 0;
	context.shadowOffsetY = 0;
	context.shadowBlur = 0;
	
	// Ok, write the text in the middle of the box
	context.fillStyle   = '#000'; // black
	context.fillText(text_1,x+DP_BOX_CORNER_RADIUS+((width-text_width_1)/2),y+DP_FONT_SIZE_PX-1);
	context.fillText(text_2,x+DP_BOX_CORNER_RADIUS+((width-text_width_2)/2),y+DP_FONT_SIZE_PX+DP_FONT_SIZE_PX+2);
}

// Draw a box with rounded corners.
// x,y is the top left corner.
function DP_drawTextBoxRounded(context,x,y,text,selected,repaint)
{
	context.textBaseline = 'middle';
	var height = DP_BOX_HEIGHT;
	var width  = context.measureText(text).width;

	// Ok draw and fill the circle
	context.beginPath();

	// set the colours
	if (selected)
		context.fillStyle   = '#ff0'; // yellow
	else
		context.fillStyle   = '#fff'; // white

	context.strokeStyle = '#000'; // black
	context.lineWidth   = 1;

	context.arc(x + DP_BOX_CORNER_RADIUS,			y + DP_BOX_CORNER_RADIUS,DP_BOX_CORNER_RADIUS					, Math.PI		, Math.PI * 1.5	, false);
	context.arc(x + width + DP_BOX_CORNER_RADIUS,	y + DP_BOX_CORNER_RADIUS,DP_BOX_CORNER_RADIUS					, Math.PI * 1.5	, 0				, false);
	context.arc(x + width + DP_BOX_CORNER_RADIUS,	y + DP_FONT_SIZE_PX + DP_BOX_CORNER_RADIUS,DP_BOX_CORNER_RADIUS	, 0				, Math.PI * 0.5	, false);
	context.arc(x + DP_BOX_CORNER_RADIUS,			y + DP_FONT_SIZE_PX + DP_BOX_CORNER_RADIUS,DP_BOX_CORNER_RADIUS	, Math.PI * 0.5	, Math.PI 		, false);
	context.lineTo(x ,y + DP_BOX_CORNER_RADIUS);

	/* shadows are accumulative (we at least in Firefox) so don't draw on repaint */
	if (!repaint)
	{
		context.shadowColor = "rgba( 0, 0, 0, 0.3 )";
		context.shadowOffsetX = 2;
		context.shadowOffsetY = 2;
		context.shadowBlur = 3;
	}

	context.stroke();
	context.fill();
	
	// reset the shadow before re-drawing
	context.shadowOffsetX = 0;
	context.shadowOffsetY = 0;
	context.shadowBlur = 0;
	
	// Ok, write the text in the middle of the box
	context.fillStyle   = '#000'; // black
	context.fillText(text,x+DP_BOX_CORNER_RADIUS,y+DP_FONT_SIZE_PX);
}

// The draws an arrow the lies directly on the x/y axis.
function DP_drawStraightArrow(context,x,y,x_length,y_length,arrow_dir)
{
	var x_offset = 0;
	var y_offset = 0;
	var y_line_offset = 0;
	var x_line_offset = 0;
	var x_arrow_end = x;
	var y_arrow_end = y;

	if (arrow_dir != 0)
	{
		if (x_length == 0)
		{
			x_offset = 3 * arrow_dir;
			y_line_offset = 0 - (4 * arrow_dir);

			if (arrow_dir == 1)
			{
				y_arrow_end = y + y_length;
			}
		}
		else
		{
			y_offset = 3 * arrow_dir;
			x_line_offset = 0 - (4 * arrow_dir);

			if (arrow_dir == 1)
			{
				x_arrow_end = x + x_length;
			}
		}
	}
	
	context.beginPath();
	context.strokeStyle = '#000'; // black
	context.fillStyle   = '#000'; // black

	context.moveTo(x,y);
	context.lineTo(x+x_length,y+y_length);
	context.stroke();

	if (arrow_dir != 0)
	{
		// draw pointer
		context.beginPath();
		context.moveTo(x_arrow_end,y_arrow_end);
		context.lineTo(x_arrow_end + x_offset + x_line_offset, y_arrow_end + y_offset + y_line_offset);
		context.lineTo(x_arrow_end - x_offset + x_line_offset, y_arrow_end - y_offset + y_line_offset);
		context.fill();
	}
}

function DP_drawArrowHead(context,x1,y1,angle,x_dir,y_dir)
{
	context.fillStyle   = '#000'; // black
	
	// now work out the arrow head
	var y2 = y1 - ((Math.sin(angle) * 4) * y_dir) - ((Math.cos(angle) * 3) * y_dir);
	var y3 = y1 - ((Math.sin(angle) * 4) * y_dir) + ((Math.cos(angle) * 3) * y_dir);
	
	var x2 = x1 + ((Math.cos(angle) * 4) * x_dir) - ((Math.sin(angle) * 3) * x_dir);
	var x3 = x1 + ((Math.cos(angle) * 4) * x_dir) + ((Math.sin(angle) * 3) * x_dir);

	context.beginPath();
	context.moveTo(x1,y1);
	context.lineTo(x2,y2);
	context.lineTo(x3,y3);
	context.fill();
}

// The draws an arrow the lies directly on the x/y axis.
function DP_drawAngledArrow(context,from_x,from_y,to_x,to_y,radius,text)
{
	context.strokeStyle = '#000'; // black
	context.fillStyle   = '#000'; // black

	// Normallise the arrow in x
	if (from_x > to_x)
	{
		var x1 = to_x;
		var y1 = to_y;
		var x2 = from_x;
		var y2 = from_y;
		var arrow_dir = 1;
	}
	else
	{
		var x1 = from_x;
		var y1 = from_y;
		var x2 = to_x;
		var y2 = to_y;
		var arrow_dir = -1;
	}

	// calculate the needed offsets
	var x_length = x2 - x1;
	var y_length = y2 - y1;
	var x_offset = Math.cos(Math.atan2(y_length,x_length)) * radius;
	var y_offset = Math.sin(Math.atan2(y_length,x_length)) * radius;
	var y_dir = Math.abs(to_y - from_y) / (to_y - from_y);

	x1 += x_offset;
	y1 += y_offset;
	x2 -= x_offset;
	y2 -= y_offset;

	// Draw the line
	context.beginPath();
	context.moveTo(x1,y1);
	context.lineTo(x2,y2);
	context.stroke();

	var angle = Math.abs(Math.atan2(y_length,x_length));

	DP_drawArrowHead(context,to_x + (x_offset * arrow_dir),to_y + (y_offset * arrow_dir),angle,arrow_dir,y_dir);
}

function DP_drawCurvedArrow(context,from_x,from_y,to_x,to_y,radius,text)
{
	context.strokeStyle = '#000'; // black
	context.fillStyle   = '#000'; // black

	// Normallise the arrow in x
	if (from_x > to_x)
	{
		var x1 = to_x;
		var y1 = to_y;
		var x2 = from_x;
		var y2 = from_y;
	}
	else
	{
		var x1 = from_x;
		var y1 = from_y;
		var x2 = to_x;
		var y2 = to_y;
	}

	// calculate the needed offsets
	var x_length = x2 - x1;
	var y_length = y2 - y1;
	var x_offset = (Math.cos(Math.atan2(y_length,x_length))) * radius;
	var y_offset = (Math.sin(Math.atan2(y_length,x_length))) * radius;

	x1 += x_offset;
	y1 += y_offset;
	x2 -= x_offset;
	y2 -= y_offset;

	/* ok, now calculate the two control points. */
	var angle = Math.abs(Math.atan2(y_length,x_length));
	var x3 = x1 - Math.sin(angle) * (radius * 2);
	var x4 = x2 - Math.sin(angle) * (radius * 2);
	var y3 = y1 + Math.cos(angle) * (radius * 2);
	var y4 = y2 + Math.cos(angle) * (radius * 2);

	/* draw the curve */
	context.beginPath();
	context.moveTo(x1,y1);
	context.bezierCurveTo(x3,y3,x4,y4,x2,y2);
	context.stroke();

	/* draw arrow head */
	var y_dir = Math.abs(to_y - from_y) / (to_y - from_y);
	DP_drawArrowHead(context,to_x - (x_offset * y_dir),to_y - (y_offset * y_dir),angle,-1,-1);
}

function DP_drawTextArrow(context,x,y,length,text)
{

	var point_dir;
	var text_size = context.measureText(text).width;
	var	line_size = (Math.abs(length) - text_size) / 2;

	if (length != 0)
	{
 		point_dir = 0 - Math.abs(length)/length;
	}
	else
	{
		point_dir = 1;
	}

	var seg_1_end 	= x - ((line_size - 1) * point_dir);
	var seg_2_start	= x - ((line_size + text_size + 1) * point_dir);
	var seg_2_end	= x - (((line_size * 2) + text_size) * point_dir);

	// draw first line segment
	context.beginPath();
	context.moveTo(x,y);
	try
	{
	context.lineTo(seg_1_end,y);
	}
	catch(e)
	{
		alert("seg_1: " + seg_1_end + " line_size: " + line_size + "point_dir:" + point_dir + "length:" + length);
	}
	context.stroke();

	// add the arrow
	context.beginPath();
	context.moveTo(seg_2_start,y);
	context.lineTo(seg_2_end,y);
	context.stroke();
	
	context.beginPath();
	context.moveTo(seg_2_end,y);
	context.lineTo(seg_2_end + (10 * point_dir),y - 4);
	context.lineTo(seg_2_end + (10 * point_dir),y + 4);
	context.fill();

	if (point_dir < 0)
	{
		context.fillText(text,seg_1_end+1,y-5);
	}
	else
	{
		context.fillText(text,seg_2_start+1,y-5);
	}
}

// x,y is top left corner
function DP_drawTextBox(context,x,y,text)
{
	var text_length = context.measureText(text).width;
			
	context.textBaseline = 'top';

	// set the colours
	context.fillStyle   = '#ddd'; // something
	context.strokeStyle = '#000'; // black
	context.lineWidth   = 1;

	// Draw some rectangles.
	context.fillRect  (x,   y, DP_BOX_TOTAL_SPACING + text_length, DP_BOX_HEIGHT);
	context.strokeRect(x,   y, DP_BOX_TOTAL_SPACING + text_length, DP_BOX_HEIGHT);

	context.fillStyle   = '#000'; // black
	context.fillText(text,x+DP_BOX_SPACING,y+DP_BOX_SPACING);
}

// This box is x-centered, and y is the top
function DP_drawCenteredTextBox(context,x,y,text)
{
	var text_length = context.measureText(text).width;
			
	context.textBaseline = 'top';

	// set the colours
	context.fillStyle   = '#ddd'; // something
	context.strokeStyle = '#000'; // black
	context.lineWidth   = 1;

	// Draw some rectangles.
	x_pos = x - (DP_BOX_TOTAL_SPACING + text_length) / 2;
	context.fillRect  (x_pos,   y, DP_BOX_TOTAL_SPACING + text_length, DP_BOX_TOTAL_SPACING + 10);
	context.strokeRect(x_pos,   y, DP_BOX_TOTAL_SPACING + text_length, DP_BOX_TOTAL_SPACING + 10);

	context.fillStyle   = '#000'; // black
	context.fillText(text,x_pos+DP_BOX_SPACING,y+DP_BOX_SPACING);
}

// The circle is x/y centred
function DP_drawTextCircle(context,x,y,radius,text)
{
	context.textBaseline = 'middle';

	// set the colours
	context.fillStyle   = '#ddd'; // something
	context.strokeStyle = '#000'; // black
	context.lineWidth   = 1;

	// Ok draw and fill the circle
	context.beginPath();
	context.arc(x,y,radius, 0, 2 * Math.PI, false);	

	context.fill();
	context.stroke();
	
	// Ok, write the text in the middle of the box
	context.fillStyle   = '#000'; // black
	context.fillText(text,x-(context.measureText(text).width/2),y);

}

// draw an arrow with text on it from to leaving the radius.
function DP_drawCircleTextArrow(context,from_x,from_y,to_x,to_y,radius,clash,text)
{
	context.textBaseline = 'middle';

	// set the colours
	context.fillStyle   = '#ddd'; // something
	context.strokeStyle = '#000'; // black
	context.lineWidth   = 1;

	// calculate the difference in the circle.
	var x_diff = from_x - to_x;
	var y_diff = from_y - to_y;

	var x_offset = Math.cos(Math.atan2(y_diff,x_diff)) * radius;
	var y_offset = Math.sin(Math.atan2(y_diff,x_diff)) * radius;

	if (from_x == to_x && from_y == to_y)
	{
		/* arrow to self */
		// calculate the offset from the x and y points to the edge of the
		// circle.
		var point_x = from_x + x_offset + Math.sin(Math.PI/4) * (radius * 2);
		var point_y1 = from_y + y_offset - Math.cos(Math.PI/4) * (radius * 2);
		var point_y2 = from_y + y_offset + Math.cos(Math.PI/4) * (radius * 2);

		context.beginPath();
		context.moveTo(from_x + x_offset + 4,from_y + y_offset);
		context.bezierCurveTo(point_x,point_y1,point_x,point_y2,from_x + x_offset + 4,from_y + y_offset);
		context.stroke();

		DP_drawArrowHead(context,from_x + x_offset,from_y + y_offset,0,1,-1);
	}
	else if (x_diff == 0 || y_diff == 0)
	{
		DP_drawStraightArrow(context,to_x+x_offset,to_y+y_offset,x_diff-x_offset*2,y_diff-y_offset*2);
	}
	else if (!clash)
	{
		DP_drawAngledArrow(context,from_x,from_y,to_x,to_y,radius,text);
	}
	else
	{
		DP_drawCurvedArrow(context,from_x,from_y,to_x,to_y,radius,text);
	}
}


