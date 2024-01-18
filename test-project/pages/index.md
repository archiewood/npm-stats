# Evidence Open Source Usage Stats

This page contains usage statistics for the Evidence open source project.

Evidence is distributed via [npm](https://www.npmjs.com/) under the package [@evidence-dev/evidence](https://www.npmjs.com/package/@evidence-dev/evidence).

## Download Stats

<BigValue
  data={daily}
  value=total_downloads
  fmt="#,###"
  title="Yesterday ({fmt(daily[0].day, 'D MMM')})"
  comparison=growth_pct
  comparisonTitle="vs. prior day"
/>

<BigValue
  data={weekly}
  value=total_downloads
  fmt="#,###"
  title="Last Week (w/c {fmt(weekly[0].week, 'D MMM')})"
  comparison=growth_pct
  comparisonTitle="vs. prior week"
/>

<BigValue
  data={monthly}
  value=total_downloads
  fmt="#,###"
  title="Last Month ({fmt(monthly[0].month, 'MMM YY')})"
  comparison=growth_pct
  comparisonTitle="vs. prior month"
/>



```yesterday
select * from evidence_stats.last_day
```



```daily
select 
  day,
  downloads as total_downloads,
  total_downloads / lag(total_downloads) over (order by day) -1 as growth_pct
from evidence_stats.max_range
where day <= strptime('${yesterday[0].day.toISOString()}', '%Y-%m-%dT%H:%M:%S.%fZ')
order by day desc
```



```weekly
select 
  date_trunc('week', day) as week,
  sum(downloads) as total_downloads,
  total_downloads / lag(total_downloads) over (order by week) -1 as growth_pct
from evidence_stats.max_range
where week <= strptime('${yesterday[0].day.toISOString()}', '%Y-%m-%dT%H:%M:%S.%fZ') - interval '1 week'
group by week
order by week desc

```

```monthly
select 
  date_trunc('month', day) as month,
  sum(downloads) as total_downloads,
  total_downloads / lag(total_downloads) over (order by month) -1 as growth_pct
from evidence_stats.max_range
where month <= strptime('${yesterday[0].day.toISOString()}', '%Y-%m-%dT%H:%M:%S.%fZ') - interval '1 month'
group by month
order by month desc
```



## Download Charts

<LineChart 
  data={daily} 
  y=total_downloads 
  x=day 
  title="Daily Package Downloads"
/>

<LineChart 
  data={weekly} 
  y=total_downloads 
  x=week
  title="Weekly Package Downloads"
/>

<LineChart 
  data={monthly} 
  y=total_downloads
  yFmt="#,###"
  x=month
  title="Monthly Package Downloads"
/>

