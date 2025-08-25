// 简单的测试脚本来验证更新功能
const { sql } = require('@vercel/postgres');

async function testUpdate() {
  try {
    console.log('🧪 开始测试更新功能...');
    
    // 1. 先创建一个测试提醒
    const createResult = await sql`
      INSERT INTO reminders (user_id, title, description, due_date, priority, category)
      VALUES ('550e8400-e29b-41d4-a716-446655440002', '测试提醒', '测试描述', '2025-01-25 00:00:00+00', 'medium', 'test')
      RETURNING id, title, description, due_date, priority, category, is_completed
    `;
    
    const testReminder = createResult[0];
    console.log('✅ 创建测试提醒:', testReminder);
    
    // 2. 测试更新功能
    const updateQuery = `
      UPDATE reminders 
      SET title = '更新后的标题', description = '更新后的描述', updated_at = NOW()
      WHERE id = '${testReminder.id}'
    `;
    
    console.log('🔧 执行更新查询:', updateQuery);
    
    await sql.unsafe(updateQuery);
    
    // 3. 查询更新后的结果
    const updatedResult = await sql`
      SELECT id, title, description, due_date, priority, category, is_completed, updated_at
      FROM reminders 
      WHERE id = ${testReminder.id}
    `;
    
    const updatedReminder = updatedResult[0];
    console.log('✅ 更新后的提醒:', updatedReminder);
    
    // 4. 清理测试数据
    await sql`DELETE FROM reminders WHERE id = ${testReminder.id}`;
    console.log('🧹 清理测试数据完成');
    
    return updatedReminder;
  } catch (error) {
    console.error('❌ 测试失败:', error);
    throw error;
  }
}

// 运行测试
testUpdate()
  .then(result => {
    console.log('🎉 测试完成:', result);
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 测试失败:', error);
    process.exit(1);
  });
