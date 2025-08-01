import { NextRequest, NextResponse } from 'next/server'
import { updatePricesCron } from '../../../../scripts/updatePricesCron'

export async function GET(request: NextRequest) {
  // Verify it's a legitimate cron request
  const authHeader = request.headers.get('authorization')
  const expectedToken = process.env.CRON_SECRET || 'your-secret-token'
  
  if (authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    console.log('🔄 Starting scheduled price update...')
    await updatePricesCron()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Domain prices updated successfully',
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Error during price update:', error)
    return NextResponse.json({ 
      error: 'Failed to update prices',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Optional: Add a POST endpoint for manual triggers
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const expectedToken = process.env.CRON_SECRET || 'your-secret-token'
  
  if (authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    console.log('🔄 Starting manual price update...')
    await updatePricesCron()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Domain prices updated successfully',
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Error during price update:', error)
    return NextResponse.json({ 
      error: 'Failed to update prices',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 